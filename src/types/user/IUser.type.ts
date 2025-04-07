import type { Roles } from 'src/enums/Roles.enum'
import type { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'
import type { Status } from 'src/enums/Status.enum'

export interface IUser {
  id: string
  name: string
  email: string
  balance: number
  status: Status
  roles: Roles[]
  shootingPermissions: ShootingPermissions[]
}
