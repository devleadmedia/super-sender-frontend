import {
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'

export interface CreateDefaults extends CreateAxiosDefaults {
  cancelPrevious?: boolean
}

export interface CustomRequestConfig extends InternalAxiosRequestConfig {
  cancelPrevious?: boolean
}

export interface CustomResponse extends AxiosResponse {
  config: CustomRequestConfig
}
