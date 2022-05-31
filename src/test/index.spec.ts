import 'mocha'
import * as chai from 'chai'
import dotenv from 'dotenv'
import { machineId } from 'machine-id2'

dotenv.config()

import { XServerClient, XServerClientOptions, Railgun } from '../'

const BASE_URL = process.env.BASE_URL

const xsconfig: XServerClientOptions = {
  apiKey: process.env.XSERVER_TOKEN || '',
  baseUrl: BASE_URL
}

const PRODUCT_ID: number = process.env.PRODUCT_ID
  ? parseInt(process.env.PRODUCT_ID)
  : 0

const xserverClient = new XServerClient(xsconfig)

describe('License Service Test', () => {
  let tiers: string[] = []
  let keys: string[] = []

  const user = {
    email: 'John.Doe@example.com',
    familyName: 'Doe',
    givenName: 'John'
  }

  const newUser = {
    email: 'Jane.Doe@example.com',
    familyName: 'Doe',
    givenName: 'Jane'
  }

  describe('Connection test', () => {
    it('should return success as a payload', async () => {
      const response = await xserverClient.testConnection()
      chai.expect(response.status).to.be.equal('success')
    }).timeout(5000)
  })

  describe('Creation / Validation test', () => {
    it('should be able to create a key', async () => {
      const tierHash = tiers[Math.floor(Math.random() * tiers.length)]

      const context = {
        ...user,
        tierHash,
        days: 1
      }

      const response = await xserverClient.createKey(context)
      chai.expect(response.status).to.be.equal('success')
    }).timeout(5000)

    it('should be able to list all the keys a product has', async () => {
      const response = await xserverClient.dumpKeys()
      chai.expect(response.status).to.be.equal('success')
    }).timeout(5000)

    it('should be able to list all the keys the user has', async () => {
      const { email } = user

      const response = await xserverClient.listKeys(email)
      chai.expect(response.status).to.be.equal('success')
      keys = response.keys.map((licenseKey) => licenseKey.key)
    }).timeout(5000)

    it('should be able to fetch information about the created key', async () => {
      chai.expect(keys.length).to.be.gt(0)

      const key = keys[Math.floor(Math.random() * keys.length)]
      const response = await xserverClient.queryKey(key)
      chai.expect(response.status).to.be.equal('success')
    }).timeout(5000)

    it('should be able to extend a key by 1 day', async () => {
      chai.expect(keys.length).to.be.gt(0)
      const serialkey = keys[Math.floor(Math.random() * keys.length)]
      const response = await xserverClient.extendKey({
        serialkey,
        days: 1
      })

      chai.expect(response.status).to.be.equal('success')
    }).timeout(5000)

    it('should be able to securely change purchase email', async () => {
      chai.expect(keys.length).to.be.gt(0)

      const serialkey = keys[Math.floor(Math.random() * keys.length)]
      const res = await xserverClient.queryKey(serialkey)

      const email = res.result.email

      const { token } = await xserverClient.beginTransfer({
        email,
        serialkey
      })

      const { givenName, familyName } = newUser

      const response = await xserverClient.confirmTransfer({
        email: newUser.email,
        transferCode: token,
        serialkey,
        givenName,
        familyName
      })

      chai.expect(response.status).to.be.equal('success')
    }).timeout(10000)
  })

  describe('Railgun license test', () => {
    let token = ''

    it('should be able to validate the license key', async (done) => {
      try {
        chai.expect(keys.length).to.be.gt(0)

        const licenseKey = keys[Math.floor(Math.random() * keys.length)]

        const railgunInstance = new Railgun(PRODUCT_ID, BASE_URL)
        const muid = await machineId()
        const licenseUser = await railgunInstance.validate(licenseKey, muid)
        token = railgunInstance.chaintoken

        chai.expect(licenseUser.name.givenName).to.be.equal(user.givenName)
        chai.expect(licenseUser.name.familyName).to.be.equal(user.familyName)

        railgunInstance.logout()
      } catch (e) {
        done(e)
      }
    }).timeout(10000)

    it('should be able to validate chained instances', async () => {
      chai.expect(keys.length).to.be.gt(0)

      const chainRailgunInstance = new Railgun(PRODUCT_ID, BASE_URL)
      const chainUser = await chainRailgunInstance.chain(token)

      chai.expect(chainUser.name.givenName).to.be.equal(user.givenName)
      chai.expect(chainUser.name.familyName).to.be.equal(user.familyName)

      chainRailgunInstance.logout()
    }).timeout(10000)
  })
})
