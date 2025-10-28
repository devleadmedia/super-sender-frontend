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
  document: IDocumentMessageWhatsapp | null
}

export interface IDocumentMessageWhatsapp {
  name: string
  size: string
  type: string
  url: string
}
