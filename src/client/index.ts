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

import { ValidationError, ServiceError } from '../errors'

export * from './interface'

const BASE_URL = 'https://licenses.railgunsecurity.com/api'


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

  testConnection = async () => {
    try {

      const options: AxiosRequestConfig = {
        url: '/',
        method: 'GET'
      }

      const { data } = await this.axios(options)
      return data

    } catch (e: any) {

      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ValidationError(error)
        }

        default: {
          throw e
        }

      }
    }
  }

  /**
   * Return all generated license keys
   */
  dumpKeys = async () => {

    try {

      const options: AxiosRequestConfig = {
        url: 'manage/dump',
        method: 'POST'
      }

      const { data } = await this.axios(options)

      return data
    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * Query license key information
   */
  queryKey = async (serialkey: string) => {

    try {

      const options: AxiosRequestConfig = {
        url: 'manage/query',
        method: 'POST',
        data: {
          serialkey
        }
      }

      const { data } = await this.axios(options)
      return data

    } catch (e: any) {

      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }
  }

  /**
   * Extend the days alloted to a license key
   */

  extendKey = async (context: ExtendLicenseKeyOptions) => {

    try {
      const { serialkey, days } = context

      const options: AxiosRequestConfig = {
        url: 'manage/extend',
        method: 'POST',
        data: {
          serialkey,
          days
        }
      }

      const { data } = await this.axios(options)

      return data


    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * Reset the specified license key
   */
  resetKey = async (context: BaseLicenseOptions) => {

    try {
      const { serialkey, email } = context

      const options: AxiosRequestConfig = {
        url: 'manage/reset',
        method: 'POST',
        data: {
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * List license keys attached to a specified email address
   */
  listKeys = async (email: string) => {

    try {
      const options: AxiosRequestConfig = {
        url: 'manage/list',
        method: 'POST',
        data: {
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * Attached discord credentials to a license key
   */
  bindDiscord = async (context: BindDiscordUserOptions) => {

    try {
      const { discord, serialkey, email } = context

      const options: AxiosRequestConfig = {
        url: 'manage/setup-discord',
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
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * Remove discord credentials from a license key
   */
  unbindDiscord = async (context: BaseLicenseOptions) => {

    try {
      const { serialkey, email } = context

      const options: AxiosRequestConfig = {
        url: 'manage/remove-discord',
        method: 'POST',
        data: {
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * List available tiers
   */
  listTiers = async () => {

    try {
      const options: AxiosRequestConfig = {
        url: 'manage/list-tiers',
        method: 'GET'
      }

      const { data } = await this.axios(options)

      return data
    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
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
        url: 'manage/create',
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
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * Update attached meta information
   */
  updateMeta = async (context: MetaLicenseKeyOptions) => {

    try {
      const { serialkey, meta } = context

      const options: AxiosRequestConfig = {
        url: 'manage/update-meta',
        method: 'POST',
        data: {
          meta,
          serialkey
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
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
        url: 'manage/ban',
        method: 'POST',
        data: {
          serialkey,
          state
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
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
        url: 'manage/create',
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
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }

  /**
   * Transfer serial key to new purchase email
   */
  beginTransfer = async (context: BaseLicenseOptions) => {

    try {
      const { email, serialkey } = context

      const options: AxiosRequestConfig = {
        url: 'manage/begintransfer',
        method: 'POST',
        data: {
          serialkey,
          email
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
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
        url: 'manage/confirmtransfer',
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
      switch (true) {

        case Axios.isAxiosError(e): {
          const { error } = e.response.data
          throw new ServiceError(error)
        }

        default: {
          throw e
        }

      }
    }

  }
}

