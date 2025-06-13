import * as AuthService from 'src/services/auth.service'
import { useLocalStorage } from './useLocalStorage'
import { useCookies } from './useCookies'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { CookieKey } from 'src/enums/CookieKey.enum'
import requester from 'src/helpers/requester/Requester.helper'
import { Roles } from 'src/enums/Roles.enum'
import { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'
import { useRouterStatic } from './useRouterStatic'

export function useAuth() {
  const { setCookie, getCookie, removeCookie } = useCookies()
  const { setLocalStorage, removeLocalStorage } = useLocalStorage()
  const { push } = useRouterStatic()

  function login(email: string, senha: string) {
    // const userData = await AuthService.login(email, senha)

    console.log(senha)

    const userData = {
      name: 'Andre',
      email,
      balance: 1232.45,
      roles: [Roles.admin, Roles.client],
      shootingPermissions: [
        ShootingPermissions.oneWay,
        ShootingPermissions.shortCode,
      ],
      token: 'doem09vg49vgm430g',
    }

    setLocalStorage(
      LocalStorageKey.user,
      JSON.stringify({
        name: userData.name,
        email: userData.email,
        balance: userData.balance,
        roles: userData.roles,
        shootingPermissions: userData.roles,
      }),
    )

    setCookie(CookieKey.token, userData.token)
    push('/app/home')
  }

  function logout() {
    removeLocalStorage(LocalStorageKey.user)
    removeCookie(CookieKey.token)
    push('/login')
  }

  async function isLoggedIn(): Promise<boolean> {
    const tokenCookie = getCookie(CookieKey.token)

    if (!tokenCookie) return false

    const isLogged = await AuthService.authSession()

    if (!isLogged) {
      removeLocalStorage(LocalStorageKey.user)
      removeCookie(CookieKey.token)
    }

    setCookie(CookieKey.token, isLogged)

    return !!isLogged
  }

  async function handleLoggedIn() {
    await requester.dispatch({
      callback: async () => {
        const islogged = await isLoggedIn()
        if (!islogged) {
          push('/login')
          removeCookie(CookieKey.token)
        }
      },
      errorCallback() {
        push('/login')
        removeCookie(CookieKey.token)
      },
    })
  }

  return { login, logout, isLoggedIn, handleLoggedIn }
}
