import type { QTableColumn } from 'quasar'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { Status } from 'src/enums/Status.enum'
import { ICampaign } from 'src/types/campaign/ICampaign.type'
import { IUser } from 'src/types/user/IUser.type'
import {
  IMessageWhatsapp,
  ITemplateMessageWhatsapp,
} from 'src/types/whatsapp/IMessageWhatsapp.type'

export interface IFormMessageWhatsapp extends IMessageWhatsapp {
  file: File | null
}

export enum CurrentTypeFile {
  audio,
  file,
  image,
  video,
}

export interface IState {
  options: {
    clients: IUser[]
    campaigns: ICampaign[]
  }
/*   midiaURLs: string[]
  currentTypeFile: CurrentTypeFile
  currentFile: File | null
  currentFileURL: string | null
  currentMessage: string */
  form: {
    id: string
    title: string
    messagens: IFormMessageWhatsapp[]
    campaignId: string
    status: Status
    urls: string[]
    typeFile: CurrentTypeFile
    file: File | null
    fileURL: string | null
    currentMessage: string
  }
  openImageURL: string
  list: ITemplateMessageWhatsapp[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ITemplateMessageWhatsapp[]
}

export const initState: IState = {
  form: {
    id: '',
    title: '',
    status: Status.active,
    messagens: [],
    campaignId: '',
    currentMessage: '',
    file: null,
    fileURL: null,
    typeFile: CurrentTypeFile.image,
    urls: [],
  },
 /*  midiaURLs: [],
  currentFile: null,
  currentFileURL: null,
  currentMessage: '',
  currentTypeFile: CurrentTypeFile.image, */
  options: {
    clients: [],
    campaigns: [],
  },
  openImageURL: '',
  actionsData: [],
  actionType: ActionDialogOptions.delete,
  filter: '',
  list: [],
}

export const messageSMSTableColumns: QTableColumn[] = [
  {
    label: 'Titulo',
    field: 'title',
    name: 'title',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Mensagem',
    field: 'message',
    name: 'message',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Status',
    field: 'status',
    name: 'status',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Ações',
    field: 'actions',
    name: 'actions',
    align: 'left',
  },
]
