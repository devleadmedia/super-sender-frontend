import { TypeRoute, TypeShot, TypeSMS } from 'src/enums/shot/sms/TypesSMS.enum'

export const typeSMSOptions = [
  { name: 'Flash', value: TypeSMS.flash },
  { name: 'Standard', value: TypeSMS.standard },
]

export const typeShotOptions = [
  { name: 'One Way', value: TypeShot.oneWay },
  { name: 'Two Way', value: TypeShot.twoWay },
]

export const typeRouteOptions = [
  { name: 'Long code', value: TypeRoute.longCode },
  { name: 'Short code', value: TypeRoute.shortCode },
]

type IDictionary<T extends TypeSMS | TypeShot | TypeRoute> = {
  [key in T]: { name: string }
}

export const typeSMSDictionary: IDictionary<TypeSMS> = {
  [TypeSMS.flash]: { name: 'Flash' },
  [TypeSMS.standard]: { name: 'Standard' },
}

export const typeShotDictionary: IDictionary<TypeShot> = {
  [TypeShot.oneWay]: { name: 'One Way' },
  [TypeShot.twoWay]: { name: 'Two Way' },
}

export const typeRouteDictionary: IDictionary<TypeRoute> = {
  [TypeRoute.longCode]: { name: 'Long code' },
  [TypeRoute.shortCode]: { name: 'Short code' },
}
