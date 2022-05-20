import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import {
  XServerClientOptions,
  BaseLicenseOptions,
  ExtendLicenseKeyOptions,
  BindDiscordUserOptions,
  EternalLicenseOptions,
  MetaLicenseKeyOptions,
  BanLicenseKeyOptions,
  LicenseOptions,
  ConfirmTransferOptions
} from './interface'

import {
  AuthorizationError,
  ValidationError,
  ServiceError
} from '../errors'

export * from './interface'

const BASE_URL = 'https://licenses.railgunsecurity.com'


export class XServerClient {
  private apiKey: string;
  private axios: AxiosInstance;

  constructor(options: XServerClientOptions) {
    this.apiKey = options.apiKey


    this.axios = Axios.create({
      baseURL: options.baseUrl || BASE_URL,
      headers: {
        authorization: `Bearer ${this.apiKey}`
      },
    })
  }

  private handleError = (e: any) => {
    const isAxiosError = Axios.isAxiosError(e)

    if (!isAxiosError) {
      throw e
    }

    if (!e.response) {
      throw new Error('This could be a CORS issue or a dropped internet connection.')
    }

    switch (e.response.status) {
      case 400: {
        throw new ValidationError(e.response.data.error)
      }

      case 401: {
        throw new AuthorizationError(e.response.data.error)
      }

      case 500: {
        throw new ServiceError(e.response.data.error)
      }

      default: {
        throw new Error(e.response.data.error)
      }
    }


  }

  testConnection = async () => {
    try {

      const options: AxiosRequestConfig = {
        url: 'api/',
        method: 'GET'
      }

      const { data } = await this.axios(options)
      return data

    } catch (e: any) {
      this.handleError(e)
    }
  }

  /**
   * Return all generated license keys
   */
  dumpKeys = async () => {

    try {

      const options: AxiosRequestConfig = {
        url: 'api/manage/dump',
        method: 'POST'
      }

      const { data } = await this.axios(options)

      return data
    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Query license key information
   */
  queryKey = async (serialkey: string) => {

    try {

      const options: AxiosRequestConfig = {
        url: 'api/manage/query',
        method: 'POST',
        data: {
          serialkey
        }
      }

      const { data } = await this.axios(options)
      return data

    } catch (e: any) {

      this.handleError(e)
    }
  }

  /**
   * Extend the days alloted to a license key
   */

  extendKey = async (context: ExtendLicenseKeyOptions) => {

    try {
      const { serialkey, days } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/extend',
        method: 'POST',
        data: {
          serialkey,
          days
        }
      }

      const { data } = await this.axios(options)

      return data


    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Reset the specified license key
   */
  resetKey = async (context: BaseLicenseOptions) => {

    try {
      const { serialkey, email } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/reset',
        method: 'POST',
        data: {
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * List license keys attached to a specified email address
   */
  listKeys = async (email: string) => {

    try {
      const options: AxiosRequestConfig = {
        url: 'api/manage/list',
        method: 'POST',
        data: {
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Attached discord credentials to a license key
   */
  bindDiscord = async (context: BindDiscordUserOptions) => {

    try {
      const { discord, serialkey, email } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/setup-discord',
        method: 'POST',
        data: {
          discord,
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Remove discord credentials from a license key
   */
  unbindDiscord = async (context: BaseLicenseOptions) => {

    try {
      const { serialkey, email } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/remove-discord',
        method: 'POST',
        data: {
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Create an eternal license key
   */
  createEternalKey = async (context: EternalLicenseOptions) => {

    try {
      const {
        email,
        tierHash,
        familyName,
        givenName,
        days = 0,
        meta
      } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/create',
        method: 'POST',

        data: {
          email,
          tierHash,
          familyName,
          givenName,
          days,
          meta,
          eternal: true
        }
      }

      const { data } = await this.axios(options)

      return data


    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Update attached meta information
   */
  updateMeta = async (context: MetaLicenseKeyOptions) => {

    try {
      const { serialkey, meta } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/update-meta',
        method: 'POST',
        data: {
          meta,
          serialkey
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Ban license key
   */
  banKey = async (context: BanLicenseKeyOptions) => {

    try {
      const {
        serialkey,
        state = true
      } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/ban',
        method: 'POST',
        data: {
          serialkey,
          state
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Create license key
   */
  createKey = async (context: LicenseOptions) => {

    try {
      const {
        email,
        tierHash,
        familyName,
        givenName,
        days = 1,
        meta
      } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/create',
        method: 'POST',
        data: {
          email,
          tierHash,
          familyName,
          givenName,
          days,
          meta
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Transfer serial key to new purchase email
   */
  beginTransfer = async (context: BaseLicenseOptions) => {

    try {
      const { email, serialkey } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/begintransfer',
        method: 'POST',
        data: {
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }

  /**
   * Complete purchase email transfer for serial key
   */
  confirmTransfer = async (context: ConfirmTransferOptions) => {

    try {
      const {
        email,
        givenName,
        familyName,
        serialkey,
        transferCode
      } = context

      const options: AxiosRequestConfig = {
        url: 'api/manage/confirmtransfer',
        method: 'POST',
        data: {
          givenName,
          familyName,
          email,
          serialkey,
          transferCode
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      this.handleError(e)
    }

  }
}

