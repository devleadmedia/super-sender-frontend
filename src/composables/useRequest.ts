import { useAuth } from './useAuth'
import { AxiosRequestConfig } from 'axios'
import { CustomRequestConfig } from 'src/types/requester/IRequester.type'

const pendingRequests: Map<string, () => void> = new Map()

export function useRequest() {
  const { handleLoggedIn } = useAuth()

  function extractBaseRoute(url: string): string {
    return url.replace(/\/[^/]+(?=\/?$)/, (match) => {
      // Remove se for número ou UUID
      return /^[0-9a-fA-F-]+$/.test(match.slice(1)) ? '' : match
    })
  }

  function getRequestKey(config: AxiosRequestConfig): string {
    const method = (config.method || 'get').toLowerCase()
    const url = config.url || ''
    const baseRoute = extractBaseRoute(url)
    return `${method}:${baseRoute}`
  }

  function handlePendingRequest(config: CustomRequestConfig): void {
    const requestKey = getRequestKey(config)

    for (const [key, cancel] of pendingRequests.entries()) {
      if (key.startsWith(requestKey)) {
        cancel() // cancela a requisição anterior
        pendingRequests.delete(key)
      }
    }

    const controller = new AbortController()
    config.signal = controller.signal

    const fullKey = `${requestKey}:${config.url}`
    pendingRequests.set(fullKey, () => controller.abort())
  }

  function clearPendingRequest(config: CustomRequestConfig): void {
    const requestKey = getRequestKey(config)
    const fullKey = `${requestKey}:${config.url}`
    pendingRequests.delete(fullKey)
  }

  function startInterceptors() {
    // RESPONSE
    /* api.interceptors.response.use(
      (response: CustomResponse) => {
        if (response.config.cancelPrevious) clearPendingRequest(response.config)

        return response
      },
      async (error) => {
        if (error.response.status === 401) await handleLoggedIn()

        const config = error.config as CustomRequestConfig

        if (config.cancelPrevious) clearPendingRequest(config)

        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error)
      },
    )

    // REQUEST
    api.interceptors.request.use((config: CustomRequestConfig) => {
      if (getCookie(CookieKey.token)) {
        config.withCredentials = true
        config.headers['Authorization'] = `Bearer ${getCookie(CookieKey.token)}`
      }

      if (config.cancelPrevious) handlePendingRequest(config)

      return config
    }) */
  }

  return {
    getRequestKey,
    handleLoggedIn,
    extractBaseRoute,
    startInterceptors,
    clearPendingRequest,
    handlePendingRequest,
  }
}
