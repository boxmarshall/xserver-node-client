import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import SafeEncode from '../safe-encode'

import { ManagerError } from '../errors'

import {
  XServerManagerOptions,
  CatValidationOptions,
  BaseOptions
} from './interface'

export * from './interface'


const BASE_URL = 'https://licenses.railgunsecurity.com/api'


export interface Encoder {
  encoder: SafeEncode;
  machineToken: string;
}

export class XServerManager {
  private apiKey: string;
  private axios: AxiosInstance;

  constructor(options: XServerManagerOptions) {
    this.apiKey = options.apiKey

    this.axios = Axios.create({
      baseURL: options.baseUrl || BASE_URL,
      headers: {
        authorization: `Bearer ${this.apiKey}`
      },
    })
  }

  generateEncoder = async (data: string): Promise<Encoder> => {
    const tokenVariation = `${data}`.substring(
      data.length - 6,
      data.length - 1
    )
    const accessToken = `${data}`.substring(0, data.length - 6)

    const machineToken = await this.fetchMachineToken({ accessToken })

    const securityKey = `${machineToken}${tokenVariation}`

    const encoder = new SafeEncode(securityKey)

    return {
      encoder, machineToken
    }
  }

  fetchMachineToken = async (config: BaseOptions) => {
    try {
      const machineToken = await this.getID(config)

      const { token = '' } = machineToken

      if (!token || !token.length) {
        throw new Error('No token available')
      }

      return token
    } catch (e: any) {

      const isAxiosError = Axios.isAxiosError(e)

      if (!isAxiosError) {
        throw e
      }

      if (!e.response) {
        throw new Error('This could be a CORS issue or a dropped internet connection.')

      }

      const {
        error = 'License server is temporarily unavailable'
      } = e.response.data


      throw new ManagerError(error)

    }
  }

  private getID = async (config: BaseOptions) => {
    try {
      const options: AxiosRequestConfig = {
        url: `v2/ping-base/get-id`,
        method: 'POST',
        data: {
          accessToken: config.accessToken
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {
      const isAxiosError = Axios.isAxiosError(e)

      if (!isAxiosError) {
        throw e
      }

      if (!e.response) {
        throw new Error('This could be a CORS issue or a dropped internet connection.')

      }

      const {
        error = 'License server is temporarily unavailable'
      } = e.response.data


      throw new ManagerError(error)

    }
  }

  validateCat = async (config: CatValidationOptions) => {
    try {
      const options: AxiosRequestConfig = {
        url: `v2/ping-base/validate-cat`,
        method: 'POST',
        data: {
          cat: config.cat
        }
      }

      const { data } = await this.axios(options)

      return data

    } catch (e: any) {

      const isAxiosError = Axios.isAxiosError(e)

      if (!isAxiosError) {
        throw e
      }

      if (!e.response) {
        throw new Error('This could be a CORS issue or a dropped internet connection.')

      }

      const {
        error = 'License server is temporarily unavailable'
      } = e.response.data


      throw new ManagerError(error)

    }
  }
}
