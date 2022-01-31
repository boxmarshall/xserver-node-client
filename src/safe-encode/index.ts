import CryptoJS from 'crypto-js'

export default class SafeEncode {
  private key: string;
  private iterations: number;
  private keySize: number;

  constructor(key: string) {
    this.key = key
    this.iterations = 100
    this.keySize = 256
  }

  generatePayload = (parameter: any): string => {
    const payload = [parameter]
    const encrypted = this.encode(JSON.stringify(payload))
    return encrypted
  }

  decodePayload = (encrypted: string): any => {
    const decrypted = this.decode(encrypted)
    const payload = JSON.parse(decrypted)
    const parameter = payload[0]
    return parameter
  }

  encode = (token: string): string => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8)
    const iv = CryptoJS.lib.WordArray.random(128 / 8)
    const key = CryptoJS.PBKDF2(this.key, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    })

    const enc_cipher = CryptoJS.AES.encrypt(token, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv
    })

    return `${salt.toString()}${iv.toString()}${enc_cipher.toString()}`
  }


  decode = (token: string): string => {
    const salt = CryptoJS.enc.Hex.parse(token.substring(0, 32))
    const iv = CryptoJS.enc.Hex.parse(token.substring(32, 32))

    const encrypted = token.substring(64)

    const key = CryptoJS.PBKDF2(this.key, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    })

    const dec_cipher = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    return dec_cipher.toString(CryptoJS.enc.Utf8)
  }
}
