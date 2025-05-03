import type { ShootingStatusSMS } from 'src/enums/shot/ShootingStatusSMS.type'
import type {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import { IBasicEntity } from '../IBasicEntity.type'
import { IMessageSMS } from './IMessageSMS.type'

export interface IShootingSMS {
  id: string
  date: string
  name: string
  typeShot: TypeShotSMS
  typeSMS: TypeSMS
  typeRoute: TypeRouteSMS
  status: ShootingStatusSMS
  message: IMessageSMS
  contactIds: string[]
  user: IBasicEntity<string>
}
