import type { Status } from 'src/enums/Status.enum'

export interface IMessageSMS {
  id: string
  title: string
  message: string
  status: Status
  alternativeMessages: string[]
  campaignId: string
}
