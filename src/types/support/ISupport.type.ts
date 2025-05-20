import { SupportStatus } from 'src/enums/support/SupportStatus.enum'
import { IBasicEntity } from '../IBasicEntity.type'

export interface ISupport {
  id: string
  title: string
  description: string
  status: SupportStatus
  requester: IBasicEntity<string>
  messages: IMessageSupport[]
  date: string
}

export interface IMessageSupport {
  id: string
  message: string
  userId: string
  date: string
  images: string[]
}
