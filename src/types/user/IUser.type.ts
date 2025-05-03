import type { Roles } from 'src/enums/Roles.enum'
import type { ShippingType } from 'src/enums/ShippingType.enum'
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
  shippingType: ShippingType[]
}
