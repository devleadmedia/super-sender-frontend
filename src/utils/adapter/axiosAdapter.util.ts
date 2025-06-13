/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosInstance } from 'axios'
import { CustomRequestConfig } from 'src/types/requester/IRequester.type'
import { useCookies } from 'src/composables/useCookies'
import { CookieKey } from 'src/enums/CookieKey.enum'
import { useAuth } from 'src/composables/useAuth'
import { useRequest } from 'src/composables/useRequest'
import {
  HttpRequestConfig,
  HttpResponse,
  HttpClient,
} from 'src/types/IAdatper.type'

const { getCookie } = useCookies()
const { handleLoggedIn } = useAuth()
const { handlePendingRequest, clearPendingRequest } = useRequest()

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance

  constructor(baseURL?: string, config?: HttpRequestConfig) {
    const axiosConfig = {
      ...(config || {}),
      ...(baseURL ? { baseURL } : {}),
    }

    this.axiosInstance = axios.create(axiosConfig)

    // RESPONSE
    this.axiosInstance.interceptors.response.use(
      (response: any) => {
        if (response.config.cancelPrevious) clearPendingRequest(response.config)

        return response
      },
      async (error) => {
        if (error.response?.status === 401) await handleLoggedIn()

        const config = error.config as CustomRequestConfig

        if (config.cancelPrevious) clearPendingRequest(config)

        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error)
      },
    )

    // REQUEST
    this.axiosInstance.interceptors.request.use(
      (config: CustomRequestConfig) => {
        if (getCookie(CookieKey.token)) {
          config.withCredentials = true
          config.headers['Authorization'] =
            `Bearer ${getCookie(CookieKey.token)}`
        }

        if (config.cancelPrevious) handlePendingRequest(config)

        return config
      },
    )
  }

  async get<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get(url, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }

  async delete<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete(url, config)
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    }
  }
}
