import 'mocha'
import * as chai from 'chai'
import dotenv from 'dotenv'

dotenv.config()

import { XServerClient, XServerClientOptions } from '../'

const xsconfig: XServerClientOptions = {
  apiKey: process.env.XSERVER_TOKEN || ''
}

const xserverClient = new XServerClient(xsconfig)

describe('License Service Test', () => {
  describe('Connection test', () => {
    it('should return success as a payload', async () => {
      const response = await xserverClient.testConnection()
      chai.expect(response.status).to.be.equal('success')
    }).timeout(20000)
  })

  describe('Creation / Validation test', () => {
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

    it('should be able to fetch tier list', async () => {
      const response = await xserverClient.listTiers()
      chai.expect(response.status).to.be.equal('success')

      tiers = response.tiers
      
    }).timeout(20000)

    it('should be able to create a key', async () => {
      const tierHash = tiers[Math.floor(Math.random() * tiers.length)]

      const context = {
        ...user,
        tierHash,
        days: 1
      }

      const response = await xserverClient.createKey(context)
      chai.expect(response.status).to.be.equal('success')

    }).timeout(20000)

    it('should be able to list all the keys a product has', async () => {
      const response = await xserverClient.dumpKeys()
      chai.expect(response.status).to.be.equal('success')

    }).timeout(20000)

    it('should be able to list all the keys the user has', async () => {
      const { email } = user

      const response = await xserverClient.listKeys(email)
      chai.expect(response.status).to.be.equal('success')

      keys = response.keys
    }).timeout(20000)

    it('should be able to fetch information about the created key', async () => {
      chai.expect(keys.length).to.be.gt(0)

      const key = keys[Math.floor(Math.random() * keys.length)]
      const response = await xserverClient.queryKey(key)
      chai.expect(response.status).to.be.equal('success')

    }).timeout(20000)

    it('should be able to extend a key by 1 day', async () => {
      chai.expect(keys.length).to.be.gt(0)
      const serialkey = keys[Math.floor(Math.random() * keys.length)]
      const response = await xserverClient.extendKey({
        serialkey,
        days: 1
      })

      chai.expect(response.status).to.be.equal('success')

    }).timeout(20000)

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

    }).timeout(20000)


  })


})