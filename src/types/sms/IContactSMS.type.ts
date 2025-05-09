import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'

export interface IContactSMS {
  id: string
  title: string
  quantityContacts: number
  client: IBasicEntity<string>
  status: Status
}
