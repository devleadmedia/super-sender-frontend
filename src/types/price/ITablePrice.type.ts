import type {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'

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
  typeShot: TypeShotSMS
  typeSMS: TypeSMS
  typeRoute: TypeRouteSMS
  value: number
}

export interface IDataEmail {
  value: number
}

export interface IDataWhatsapp {
  value: number
}
