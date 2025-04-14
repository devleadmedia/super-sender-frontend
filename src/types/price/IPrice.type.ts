import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'
import type { IDataEmail, IDataSMS, IDataWhatsapp, ITablePrice } from './ITablePrice.type'

export interface IPrice {
  id: string
  client: IBasicEntity<string>
  status: Status
  tablePriceSMS: ITablePrice<IDataSMS>[]
  tablePriceEmail: ITablePrice<IDataEmail>[]
  tablePriceWhatsapp: ITablePrice<IDataWhatsapp>[]
}
