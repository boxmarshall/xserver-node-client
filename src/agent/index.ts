import Events from 'events'
import { v4 as uuid } from 'uuid'
import SocketIO, { Socket } from 'socket.io-client'

import SafeEncode from '../safe-encode'

import { AgentConnectionFailure } from '../errors'

interface SocketHeader {
  [key: string]: string
}

export interface AgentOptions {
  url: string;
  accessToken: string;
  seed: number;
  path: string;
  machineToken: string;
  headers?: SocketHeader;
  timeout?: number;
}

export interface Solution {
  encoder: SafeEncode;
  socket: Socket;
  sid: string;
}

export interface SynchronizationPayload {
  securityKey: string;
  socket: Solution['socket']
}

export class XServerAgent extends Events {
  private url: AgentOptions['url']
  private path: AgentOptions['path'];
  private seed: AgentOptions['seed'];
  private headers: AgentOptions['headers'];
  private accessToken: AgentOptions['accessToken'];
  private machineToken: AgentOptions['machineToken'];
  private timeout: AgentOptions['timeout'];

  constructor(options: AgentOptions) {
    super()
    this.setMaxListeners(0)



    this.url = options.url
    this.path = options.path
    this.seed = options.seed
    this.accessToken = options.accessToken
    this.machineToken = options.machineToken
    this.headers = options.headers || {}
    this.timeout = options.timeout || 120 * 1000

  }

  createTimestamp = (): string => {
    if (!this.seed) {
      throw new Error('Invalid Seed - No seed provided')
    }

    if (isNaN(this.seed)) {
      throw new Error('Invalid Seed - Please specify a number')
    }

    const TOI = `${Date.now() * this.seed}`

    if (TOI.length < 7) {
      throw new Error('Invalid Seed - Please use a longer seed')
    }

    return TOI.substring(TOI.length - 6, TOI.length - 1)
  }

  validate = (): Promise<SynchronizationPayload> =>
    new Promise((resolve, reject) => {
      try {
        if (!this.accessToken || !this.accessToken.length) {
          throw new Error('Missing access token')
        }

        const connectionOptions = {
          path: this.path,
          transports: ['websocket', 'polling'],
          extraHeaders: this.headers
        }

        const socket = SocketIO(this.url, connectionOptions)

        const timestamp = this.createTimestamp()

        const securityKey = `${this.machineToken}${timestamp}`
        const syncronizationKey = `${this.accessToken}${timestamp}`

        // force timeout with custom timeout duration
        let connectionTimout = setTimeout(() => {
          socket.close()
          reject(new AgentConnectionFailure('Connection timed out'))
        }, this.timeout)

        socket.on('bridge-sync-error', () => {
          socket.close()

          this.emit(
            'deauth',
            new AgentConnectionFailure('Bridge connection failed')
          )
        })

        socket.once('connect', () => {
          clearTimeout(connectionTimout)

          socket.once('sync', () => {
            resolve({ securityKey, socket })
          })

          socket.once('resync', () => socket.emit('sync', syncronizationKey))
        })

      } catch (e) {
        reject(e)
      }
    })


  connect = async (): Promise<Solution> => {
    const { securityKey, socket } = await this.validate()

    const encoder = new SafeEncode(securityKey)
    const sid = uuid()

    const solution = {
      encoder,
      socket,
      sid
    }

    return solution
  }
}

