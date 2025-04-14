import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'

export interface ISenderByClient {
  id: string
  status: Status
  client: IBasicEntity<string>
  senderIds: string[]
}
