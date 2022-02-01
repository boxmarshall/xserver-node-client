import CryptoJS from 'crypto-js'

export default class SafeEncode {
  private key: string;
  private iterations: number;
  private keySize: number;

  constructor(key: string) {
    this.key = Buffer.from(key).toString('hex')
    this.iterations = 100
    this.keySize = 256
  }

  generatePayload = (payload: any): string => {
    const safepayload = JSON.stringify({ payload })

    const encrypted = this.encode(safepayload)
    return encrypted
  }

  decodePayload = (encrypted: string): any => {
    const decrypted = this.decode(encrypted)
    const { payload } = JSON.parse(decrypted)
    return payload
  }

  encode = (token: string): string => {
    const salt = CryptoJS.lib.WordArray.random(32)
    const iv = CryptoJS.lib.WordArray.random(32)
    const key = CryptoJS.PBKDF2(this.key, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    })


    const encryptedCypher = CryptoJS.AES.encrypt(token, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv
    })

    const saltedCypher = `${salt.toString()}${iv.toString()}${encryptedCypher.toString()}`

    return Buffer.from(saltedCypher).toString('hex')
  }


  decode = (raw: string): string => {
    const saltedCypher = Buffer.from(raw, 'hex').toString('utf8')

    const salt = CryptoJS.enc.Hex.parse(saltedCypher.substring(0, 64))
    const iv = CryptoJS.enc.Hex.parse(saltedCypher.substring(64, 128))

    const encryptedCypher = saltedCypher.substring(128)

    const key = CryptoJS.PBKDF2(this.key, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    })


    const decryptedCypher = CryptoJS.AES.decrypt(encryptedCypher, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })


    return decryptedCypher.toString(CryptoJS.enc.Utf8)
  }
}
