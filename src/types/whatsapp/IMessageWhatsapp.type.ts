import type { Status } from 'src/enums/Status.enum'

export interface ITemplateMessageWhatsapp {
  id: string
  title: string
  messagens: IMessageWhatsapp[]
  status: Status
  campaignId: string
}

export interface IMessageWhatsapp {
  id: string
  message: string
  imageURL: string | null
  videoURL: string | null
  audioURL: string | null
  fileURL: string | null
}
