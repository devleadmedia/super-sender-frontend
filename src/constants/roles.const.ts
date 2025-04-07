import { Roles } from 'src/enums/Roles.enum'

export const rolesOptions = [
  { name: 'Administrador', value: Roles.admin },
  { name: 'Cliente', value: Roles.client },
]

type IDictionary = {
  [key in Roles]: { name: string}
}

export const rolesDictionary: IDictionary = {
  [Roles.admin]: { name: 'Administrador' },
  [Roles.client]: { name: 'Cliente' },
}
