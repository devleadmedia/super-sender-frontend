import type {
  TypeRoute,
  TypeShot,
  TypeSMS,
} from 'src/enums/shot/sms/TypesSMS.enum'

export interface ITablePriceResult {
  tableSMS: ITablePrice<IDataSMS>[]
  tableEmail: ITablePrice<IDataEmail>[]
  tableWhatsapp: ITablePrice<IDataWhatsapp>[]
}

export interface ITablePrice<T extends IDataSMS | IDataEmail | IDataWhatsapp> {
  name: string
  data: T[]
}

export interface IDataSMS {
  typeShot: TypeShot
  typeSMS: TypeSMS
  typeRoute: TypeRoute
  value: number
}

export interface IDataEmail {
  value: number
}

export interface IDataWhatsapp {
  value: number
}
