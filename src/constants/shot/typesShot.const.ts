import { TypeRoute } from 'src/enums/shot/TypeRoute.enum'
import { TypeShot } from 'src/enums/shot/TypeShot.enum'
import { TypeSMS } from 'src/enums/shot/TypeSMS.enum'

export const typeSMSOptions = [
  { name: 'One Way', value: TypeSMS.oneWay },
  { name: 'Two Way', value: TypeSMS.twoWay },
]

export const typeShotOptions = [
  { name: 'Flash', value: TypeShot.flash },
  { name: 'Standard', value: TypeShot.standard },
]

export const typeRouteOptions = [
  { name: 'Long code', value: TypeRoute.longCode },
  { name: 'Short code', value: TypeRoute.shortCode },
]

type IDictionary<T extends TypeSMS | TypeShot | TypeRoute> = {
  [key in T]: { name: string }
}

export const typeSMSDictionary: IDictionary<TypeSMS> = {
  [TypeSMS.oneWay]: { name: 'One Way' },
  [TypeSMS.twoWay]: { name: 'Two Way' },
}

export const typeShotDictionary: IDictionary<TypeShot> = {
  [TypeShot.flash]: { name: 'Flash' },
  [TypeShot.standard]: { name: 'Standard' },
}

export const typeRouteDictionary: IDictionary<TypeRoute> = {
  [TypeRoute.longCode]: { name: 'Long code' },
  [TypeRoute.shortCode]: { name: 'Short code' },
}
