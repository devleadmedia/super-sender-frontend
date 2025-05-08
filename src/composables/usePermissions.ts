import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { useLocalStorage } from './useLocalStorage'
import { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'

export function usePermissions() {
  const { getLocalStorage } = useLocalStorage()

  function getShootingPermission(): ShootingPermissions[] {
    return JSON.parse(getLocalStorage(LocalStorageKey.user)).shootingPermissions || []
  }

  function hasShootingPermission(
    requiredRoles: ShootingPermissions[],
  ): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true
    const userRoles = getShootingPermission()
    return requiredRoles.every((role) => userRoles.includes(role))
  }

  return {
    hasShootingPermission,
  }
}
