import { HttpClient, HttpRequestConfig } from 'src/types/IAdatper.type'
import { AxiosHttpClient } from './axiosAdapter.util'

export class HttpClientFactory {
  static createHttpClient(
    type: 'axios' | 'fetch' = 'axios',
    baseURL?: string,
    config?: HttpRequestConfig,
  ): HttpClient {
    switch (type) {
      case 'axios':
        return new AxiosHttpClient(baseURL, config)
      default:
        throw new Error(`Tipo de HttpClient não suportado: ${type}`)
    }
  }
}
