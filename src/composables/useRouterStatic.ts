export function useRouterStatic() {
  const URL_BASE = `${window.location.origin}/#`

  function push(path: string) {
    window.open(`${URL_BASE}${path}`, '_self')
  }

  return { push }
}
