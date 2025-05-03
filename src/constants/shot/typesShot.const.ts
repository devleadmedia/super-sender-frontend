import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'

export const typeSMSOptions = [
  { name: 'Flash', value: TypeSMS.flash },
  { name: 'Standard', value: TypeSMS.standard },
]

export const typeShotSMSOptions = [
  { name: 'One Way', value: TypeShotSMS.oneWay },
  { name: 'Two Way', value: TypeShotSMS.twoWay },
]

export const typeRouteSMSOptions = [
  { name: 'Long code', value: TypeRouteSMS.longCode },
  { name: 'Short code', value: TypeRouteSMS.shortCode },
]

type IDictionary<T extends TypeSMS | TypeShotSMS | TypeRouteSMS> = {
  [key in T]: { name: string }
}

export const typeSMSDictionary: IDictionary<TypeSMS> = {
  [TypeSMS.flash]: { name: 'Flash' },
  [TypeSMS.standard]: { name: 'Standard' },
}

export const typeShotSMSDictionary: IDictionary<TypeShotSMS> = {
  [TypeShotSMS.oneWay]: { name: 'One Way' },
  [TypeShotSMS.twoWay]: { name: 'Two Way' },
}

export const typeRouteSMSDictionary: IDictionary<TypeRouteSMS> = {
  [TypeRouteSMS.longCode]: { name: 'Long code' },
  [TypeRouteSMS.shortCode]: { name: 'Short code' },
}
