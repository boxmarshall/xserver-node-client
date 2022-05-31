import Events from 'events'

import { LicenseManager, LicenseManagerOptions, User } from './license-manager'

import { ValidationError } from '../errors'

export { User } from './license-manager'

export class Railgun extends Events {
  private productId: number
  private host: string | null = null
  private mid: string | null = null
  private manager: LicenseManager | null = null

  constructor(productId: number, host: string | null = null) {
    super()
    this.setMaxListeners(0)

    this.host = host
    this.productId = productId
  }

  get chaintoken(): string {
    if (this.mid === null) {
      return ''
    }

    return Buffer.from(this.mid).toString('hex')
  }

  private waitforconnection = (manager: LicenseManager) => {
    // forward all essential events

    manager.on('connected', () => this.emit('connection-established'))
    manager.on('linked', () => this.emit('license-valid'))
    manager.on('error', () => this.emit('connection-failed'))
    manager.on('deauth', () => this.emit('secure-logout'))

    this.manager = manager
  }

  private fetchUser = (manager: LicenseManager): Promise<User> =>
    new Promise((resolve, reject) => {
      let connectionTimeout: NodeJS.Timer | null = null

      manager.once('currentUser', (user: User) => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout)
        }

        resolve(user)
      })

      manager.emit('getUser')

      setTimeout(() => {
        reject(new ValidationError('Timeout fetching user'))
      }, 10000)
    })

  logout = () => {
    this.manager?.disconnect()
    this.manager = null
  }

  chain = async (chaintoken: string): Promise<User> => {
    const mid = Buffer.from(chaintoken, 'hex').toString('utf8')

    const [token, muid] = mid.split('##')

    const options: LicenseManagerOptions = {
      muid,
      productId: this.productId,
      host: this.host
    }

    const licenseManager = new LicenseManager(options)

    this.waitforconnection(licenseManager)

    await licenseManager.chainLicense(token)
    const user = await this.fetchUser(licenseManager)

    return user
  }

  pulse = (manager: LicenseManager): void => {
    manager.emit('pulse')
  }

  validate = async (license: string, muid: string): Promise<User> => {
    const options: LicenseManagerOptions = {
      muid,
      productId: this.productId,
      host: this.host
    }

    const licenseManager = new LicenseManager(options)

    licenseManager.once('connected', (token) => {
      this.mid = `${token}##${muid}`
    })

    this.waitforconnection(licenseManager)

    try {
      await licenseManager.activateLicense(license)
    } catch (_) {
      await licenseManager.checkLicense(license)
    }

    this.emit('validation-successful')

    const user = await this.fetchUser(licenseManager)

    return user
  }
}
