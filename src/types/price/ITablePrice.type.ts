import type {
  TypeRoute,
  TypeShot,
  TypeSMS,
} from 'src/enums/shot/sms/TypesSMS.enum'

export interface ITablePriceResult {
  tableSMS: ITablePrice<IDataSMS>[]
  tableEmail: ITablePrice<undefined>[]
  tableWhatsapp: ITablePrice<undefined>[]
}

export interface ITablePrice<T> {
  name: string
  data: T[]
}

export interface IDataSMS {
  typeShot: TypeShot
  typeSMS: TypeSMS
  typeRoute: TypeRoute
  value: number
}
