import type { Roles } from 'src/enums/Roles.enum'
import type { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'

export interface IUserAuth {
  name: string
  email: string
  balance: number
  roles: Roles[]
  shootingPermissions: ShootingPermissions[]
  token: string
}
