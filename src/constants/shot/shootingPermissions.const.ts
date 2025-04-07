import { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'

export const permissionsOptions = [
  { name: 'One Way', value: ShootingPermissions.oneWay },
  { name: 'Two Way', value: ShootingPermissions.twoWay },
  { name: 'Long Code', value: ShootingPermissions.longCode },
  { name: 'Short Code', value: ShootingPermissions.shortCode },
  { name: 'Flash SMS', value: ShootingPermissions.flashSMS },
  { name: 'Standard', value: ShootingPermissions.standard },
]

type IDictionary = {
  [key in ShootingPermissions]: { name: string }
}

export const shootingPermissionsDictionary: IDictionary = {
  [ShootingPermissions.oneWay]: { name: 'One Way' },
  [ShootingPermissions.twoWay]: { name: 'Two Way' },
  [ShootingPermissions.longCode]: { name: 'Long Code' },
  [ShootingPermissions.shortCode]: { name: 'Short Code' },
  [ShootingPermissions.flashSMS]: { name: 'Flash SMS' },
  [ShootingPermissions.standard]: { name: 'Standard' },
}
