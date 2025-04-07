import type { TypeRoute } from 'src/enums/shot/TypeRoute.enum'
import type { TypeShot } from 'src/enums/shot/TypeShot.enum'
import type { TypeSMS } from 'src/enums/shot/TypeSMS.enum'

export interface ITablePrice {
  name: string
  data: ITablePriceData[]
}

export interface ITablePriceData {
  typeShot: TypeShot
  typeSMS: TypeSMS
  typeRoute: TypeRoute
  value: number
}
