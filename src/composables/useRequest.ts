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

  return {
    getRequestKey,
    handleLoggedIn,
    extractBaseRoute,
    clearPendingRequest,
    handlePendingRequest,
  }
}
