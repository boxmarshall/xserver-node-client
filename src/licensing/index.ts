import Events from 'events'
import machineId from 'machine-uuid'

import { LicenseManager, LicenseManagerOptions, User } from './license-manager'

import { ValidationError } from '../errors'


export class Railgun extends Events {
    private productId: number;
    private host: string | null;

    constructor(productId: number, host: string | null = null) {
        super()
        this.setMaxListeners(0)

        this.host = host
        this.productId = productId
    }

    private waitforconnection = (manager: LicenseManager) => {


        this.on('deactivate', () => manager.emit('deactivate'))

        // forward all essential events

        manager.on('connected', () => this.emit('connection-established'))
        manager.on('linked', () => this.emit('license-valid'))
        manager.on('error', () => this.emit('connection-failed'))
        manager.on('deauth', () => this.emit('secure-logout'))
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
        this.emit('deactivate')
    }


    validate = async (license: string): Promise<User> => {

        const muid = await machineId()
        const options: LicenseManagerOptions = {
            muid,
            productId: this.productId,
            host: this.host
        }

        const licenseManager = new LicenseManager(options)
        this.waitforconnection(licenseManager)

        try {
            await licenseManager.activateLicense(license)
        } catch (_) {
            await licenseManager.checkLicense(license)
        }

        const user = await this.fetchUser(licenseManager)

        return user

    }
}

