import type { ShippingStatusSMS } from 'src/enums/shipping/ShippingStatusSMS.enum'

export interface IShippingSMS {
  id: string
  phoneNumber: number
  sender: number
  operatorName: string
  message: string
  totalCharacters: number
  status: ShippingStatusSMS
  ddd: string
  calledAt: string | null
  replies: IReply[]
  parts: number
  sentAt?: string
  deliveredAt?: string
}

export interface IReply {
  id: number
  content: string
  sender: string
  receivedAt: string
  messageId: number
  shotId: number
}
