import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'
import type { ITablePrice } from './ITablePrice.type'

export interface IPrice {
  id: string
  name: string
  client: IBasicEntity<string>
  status: Status
  tablePrice: ITablePrice[]
}
