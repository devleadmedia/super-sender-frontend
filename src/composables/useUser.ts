import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { useLocalStorage } from './useLocalStorage'
import { Roles } from 'src/enums/Roles.enum'

export function useRules() {
  function isAdmin() {
    const { getLocalStorage } = useLocalStorage()

    const userRoles: Roles[] =
      JSON.parse(getLocalStorage(LocalStorageKey.user)).roles || []

    return userRoles.includes(Roles.admin)
  }

  return { isAdmin }
}
