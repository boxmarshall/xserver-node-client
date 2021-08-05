const uuid = require('uuid').v4
const Events = require('events')
const SocketIO = require('socket.io-client')

const { SafeEncode } = require('../safe-encode')

const { AgentConnectionFailure } = require('../errors')

class XServerAgent extends Events {
  constructor({
    accessToken,
    seed,
    url,
    path,
    machineToken,
    headers = {},
    timeout = 120 * 1000
  }) {
    super()
    this.setMaxListeners(0)

    this.url = url
    this.path = path
    this.seed = seed
    this.headers = headers
    this.accessToken = accessToken
    this.machineToken = machineToken
    this.connectionTimeout = timeout
  }

  createTimestamp() {
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

    return TOI.substr(TOI.length - 6, TOI.length - 1)
  }

  validate() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.accessToken) {
          throw new Error('No session provided')
        }

        const connectionOptions = {
          path: this.path,
          transports: ['websocket', 'polling'],
          rememberTransport: false,
          extraHeaders: this.headers
        }

        const socket = SocketIO(this.url, connectionOptions)

        const timestamp = this.createTimestamp()

        const synKey = `${this.accessToken}${timestamp}`
        const secKey = `${this.machineToken}${timestamp}`

        socket._connectTimer = setTimeout(() => {
          try {
            socket.close()
          } catch (_) {
          } finally {
            reject(new AgentConnectionFailure('Connection failed'))
          }
        }, this.connectionTimeout)

        socket.once('connect', () => clearTimeout(socket._connectTimer))

        socket.on('connect', () => {
          socket.on('sync', () => {
            resolve({ secKey, socket })
          })

          socket.on('bridge-sync-error', () => {
            socket.close()

            this.emit(
              'deauth',
              new AgentConnectionFailure('Bridge connection failed')
            )
          })

          socket.on('resync', () => socket.emit('sync', synKey))
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  connect() {
    return new Promise(async (resolve, reject) => {
      try {
        const { secKey, socket } = await this.validate()
        const encoder = new SafeEncode(secKey)
        const sid = uuid()

        const solution = {
          encoder,
          socket,
          sid
        }

        resolve(solution)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = {
  XServerAgent
}
