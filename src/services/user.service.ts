import { api } from 'src/boot/axios'
import { Roles } from 'src/enums/Roles.enum'
import { ShippingType } from 'src/enums/ShippingType.enum'
import { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'
import { Status } from 'src/enums/Status.enum'
import type { IUser } from 'src/types/user/IUser.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<IUser[]> {
  /* const { data } = await api.get('/users')
  return data.users */
  await fakePromise(1000)
  return [
    {
      id: '1',
      name: 'Nome 1',
      email: 'mail.com',
      roles: [Roles.client],
      shootingPermissions: [
        ShootingPermissions.flashSMS,
        ShootingPermissions.longCode,
        ShootingPermissions.shortCode,
      ],
      status: Status.active,
      balance: 1203,
      shippingType: [ShippingType.sms, ShippingType.email],
    },
    {
      id: '2',
      name: 'Nome 2',
      email: 'mail.com',
      roles: [Roles.admin],
      shootingPermissions: [],
      status: Status.active,
      balance: 204.3,
      shippingType: [ShippingType.email],
    },
    {
      id: '3',
      name: 'Nome 3',
      email: 'mail.com',
      roles: [Roles.admin],
      shootingPermissions: [],
      status: Status.active,
      balance: 561.45,
      shippingType: [ShippingType.whatsapp],
    },
  ]
}

export async function create(
  email: string,
  name: string,
  roles: Roles[],
  shootingPermissions: ShootingPermissions[],
  password: string,
) {
  await api.post('/users', {
    email,
    name,
    roles,
    password,
    shootingPermissions,
  })
}

export async function save(
  id: string,
  email: string,
  name: string,
  password: string,
  status: Status,
  roles: Roles[],
  shootingPermissions: ShootingPermissions[],
) {
  await api.put(`/users/${id}`, {
    email,
    name,
    password,
    status,
    roles,
    shootingPermissions,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/users/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/users/disable', {
    ids,
  })
}
