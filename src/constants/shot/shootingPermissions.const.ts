import { ShippingType } from 'src/enums/ShippingType.enum'
import { ShootingPermissions } from 'src/enums/shot/ShootingPermissions.enum'

export const shootingPermissionsOptions = [
  {
    name: 'One Way',
    type: ShippingType.sms,
    value: ShootingPermissions.oneWay,
  },
  {
    name: 'Two Way',
    type: ShippingType.sms,
    value: ShootingPermissions.twoWay,
  },
  {
    name: 'Long Code',
    type: ShippingType.sms,
    value: ShootingPermissions.longCode,
  },
  {
    name: 'Short Code',
    type: ShippingType.sms,
    value: ShootingPermissions.shortCode,
  },
  {
    name: 'Flash SMS',
    type: ShippingType.sms,
    value: ShootingPermissions.flashSMS,
  },
  {
    name: 'Standard',
    type: ShippingType.sms,
    value: ShootingPermissions.standard,
  },
  {
    name: 'Email',
    type: ShippingType.email,
    value: ShootingPermissions.exampleEmail,
  },
  {
    name: 'Whatsapp',
    type: ShippingType.whatsapp,
    value: ShootingPermissions.exampleWhasapp,
  },
]

type IDictionary = {
  [key in ShootingPermissions]: { name: string; type: ShippingType }
}

export const shootingPermissionsDictionary: IDictionary = {
  [ShootingPermissions.oneWay]: {
    name: 'One Way',
    type: ShippingType.sms,
  },
  [ShootingPermissions.twoWay]: {
    name: 'Two Way',
    type: ShippingType.sms,
  },
  [ShootingPermissions.longCode]: {
    name: 'Long Code',
    type: ShippingType.sms,
  },
  [ShootingPermissions.shortCode]: {
    name: 'Short Code',
    type: ShippingType.sms,
  },
  [ShootingPermissions.flashSMS]: {
    name: 'Flash SMS',
    type: ShippingType.sms,
  },
  [ShootingPermissions.standard]: {
    name: 'Standard',
    type: ShippingType.sms,
  },
  [ShootingPermissions.exampleEmail]: {
    name: 'Email',
    type: ShippingType.email,
  },
  [ShootingPermissions.exampleWhasapp]: {
    name: 'Whatsapp',
    type: ShippingType.whatsapp,
  },
}
