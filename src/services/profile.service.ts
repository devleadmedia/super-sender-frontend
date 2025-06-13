import { httpClientAxios } from 'src/boot/axios'
import type { IProfile } from 'src/types/user/IProfile.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function save(
  id: string,
  email: string,
  name: string,
  password: string,
) {
  await httpClientAxios.put(`/users/${id}`, {
    id,
    email,
    name,
    password,
  })

  return {
    id,
    email,
    name,
    password,
  }
}

export async function getProfile(): Promise<IProfile> {
  /* DEVE PESQUISAR USUARIO PELO TOKEN */
  /* const { data } = await httpClientAxios.get('/users/profile')
  return data */

  await fakePromise(1000)

  return {
    id: '1',
    email: 'email.com',
    name: 'Nome',
  }
}
