import { httpClientAxios } from 'src/boot/axios'
import { useCookies } from 'src/composables/useCookies'
import { CookieKey } from 'src/enums/CookieKey.enum'
import type { IUserAuth } from 'src/types/user/IUserAuth.type'

export async function login(
  email: string,
  password: string,
): Promise<IUserAuth> {
  const { data } = await httpClientAxios.post<IUserAuth>(
    '/sessions',
    {
      email,
      password,
    },
    { withCredentials: true },
  )

  return data
}

export async function authSession(token?: string): Promise<string> {
  const { getCookie } = useCookies()

  const { data } = await httpClientAxios.patch<string>(
    '/token/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${token ?? getCookie(CookieKey.token)}`,
      },
      withCredentials: true,
    },
  )

  return data
}
