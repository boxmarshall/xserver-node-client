import SocketIO, { Socket } from 'socket.io-client'
import Events from 'events'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import SafeEncode from '../../safe-encode'

import {
  LicenseServerUnavailable
} from '../../errors'


export interface LicenseManagerOptions {
  productId: number;
  muid: string;
  host: string | null;
  timeout?: number;
}

export interface User {
  name: {
    familyName: string;
    givenName: string;
  },
  expiryDate: string
  discord: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    isBot: boolean;
    nitro: boolean;
    email: string;
    emailVerified: boolean;
  }
}

export class LicenseManager extends Events {
  private encoder: SafeEncode | null;
  private timeout: number;
  private productId: number;
  private muid: string;
  private axios: AxiosInstance;
  private host: string;

  constructor(options: LicenseManagerOptions) {
    super()

    this.setMaxListeners(0)

    this.muid = options.muid
    this.productId = options.productId

    this.timeout = options.timeout || 60 * 1000
    this.encoder = null

    this.host = options.host || 'https://licenses.railgunsecurity.com'
    this.axios = Axios.create({
      baseURL: this.host
    })

  }

  private decode = (token: string) => {
    return this.encoder?.decodePayload(token)
  }

  private handleuser = (data: string) => {
    const user = this.decode(data)
    this.emit('currentUser', user as User)
  }

  private handledeauthorization = (data: string) => {
    const decoded = this.decode(data)
    this.emit('deauthorized', decoded)
  }

  private createlink = (socket: Socket) => {

    socket.on('currentUser', this.handleuser)

    socket.on('deauth', this.handledeauthorization)

    this.on('getUser', () => socket.emit('fetchUser'))

    this.on('deactivate', () => {
      socket.emit('deactivate')
      socket.disconnect()
    })

    this.emit('linked')
  }

  private waitforconnection = (socket: Socket) =>
    new Promise((resolve, reject) => {
      // force timeout with custom timeout duration
      let connectionTimout = setTimeout(() => {
        socket.close()
        reject(new LicenseServerUnavailable('Connection timed out'))
      }, this.timeout)

      socket.once('connect', () => {
        clearTimeout(connectionTimout)
      })



      socket.once('forbidden', () => reject(new Error('Forbidden')))
      socket.once('authorized', () => resolve(socket))
    })


  private createConnection = async (cis: string): Promise<void> => {

    this.encoder = new SafeEncode(cis)

    const cid = this.muid

    const extraHeaders = {
      cid,
      cis
    }

    const options = {
      autoConnect: true,
      secure: true,
      path: '/serverpulse',
      rejectUnauthorized: true,
      transports: ['polling'],
      rememberTransport: false,
      transportOptions: {
        polling: {
          extraHeaders
        }
      }
    }

    const socket = SocketIO(this.host, options)

    await this.waitforconnection(socket)

    this.createlink(socket)
  }

  async checkLicense(license: string) {
    try {


      const options: AxiosRequestConfig = {
        url: `api/v2/authorize/validate`,
        method: 'POST',
        timeout: this.timeout,
        data: {
          serialkey: license,
          muid: this.muid,
          pid: this.productId
        }
      }

      const {
        data: {
          success,
          token,
          error
        }
      } = await this.axios(options)


      if (!success) {
        throw new Error(error || 'Invalid Key')
      }

      if (!token) {
        throw new Error('Secure link unavailable')
      }

      this.emit('connected', token)

      await this.createConnection(token)


    } catch (e: any) {

      switch (true) {
        case Axios.isAxiosError(e): {
          const {
            error = 'License server is temporarily unavailable'
          } = e.response.data


          throw new LicenseServerUnavailable(error)
        }

        default: {
          throw e
        }
      }
    }
  }

  async activateLicense(license: string) {
    try {
      const options: AxiosRequestConfig = {
        url: `api/v2/authorize/activate`,
        method: 'POST',
        timeout: this.timeout,
        data: {
          serialkey: license,
          muid: this.muid,
          pid: this.productId
        }
      }

      const {
        data: {
          success,
          token,
          error
        }
      } = await this.axios(options)


      if (!success) {
        throw new Error(error)
      }

      if (!token) {
        throw new Error('Secure link unavailable')
      }


      this.emit('connected', token)
      await this.createConnection(token)

    } catch (e: any) {

      switch (true) {
        case Axios.isAxiosError(e): {
          const {
            error = 'License server is temporarily unavailable'
          } = e.response.data


          throw new LicenseServerUnavailable(error)
        }

        default: {
          throw e
        }
      }
    }
  }
}