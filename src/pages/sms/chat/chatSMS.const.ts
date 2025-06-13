import type { QTableColumn } from 'quasar'
import { IContactChatSMS, IMessageChatSMS } from 'src/types/sms/IChatSMS.type'
import { ITriggerWord } from 'src/types/sms/ITriggerWord.type'
import { formatDate } from 'src/utils/date.util'

export const LIMIT_MB = 2
export const MAX_LIMIT_MB = 10

export interface IState {
  chat: {
    currentMessage: string
    search: string
    contact: IContactChatSMS
    messagens: IMessageChatSMS[]
    totalCredits: number | null
    errors: number
  } | null
  sidebar: {
    search: string
    filterBy: 'all' | 'unRead' | 'favorites'
  }
  list: IContactChatSMS[]
  filter: string
  triggerWords: ITriggerWord[]
  actionData: IContactChatSMS | null
}

export const initState: IState = {
  chat: null,
  filter: '',
  list: [],
  sidebar: {
    filterBy: 'all',
    search: '',
  },
  triggerWords: [],
  actionData: null,
}

export const dialog = {
  sendMessage: 'sendMessage-dasdasd12g4',
  delete: 'delete-dasdasd12g4',
}

export const loader = {
  list: 'list-dasdasd12g4',
  getMessagens: 'getMessagens-d1g34gg31d',
  sendMessage: 'sendMessage-1e12f342f',
  confirmSendMessage: 'confirmSendMessage-1342te12f342f',
  favorite: 'favorite-d23gh45j56',
  delete: 'delete-d23gh45j56',
}

export const supportTableColumns: QTableColumn[] = [
  {
    label: 'Data',
    field: 'date',
    name: 'date',
    sortable: true,
    align: 'left',
    format: (v) => formatDate(v),
  },
  {
    label: 'Protocolo',
    field: 'id',
    name: 'id',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Titulo',
    field: 'title',
    name: 'title',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Descrição',
    field: 'description',
    name: 'description',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Cliente',
    field: (row) => row.requester.name,
    name: 'requester',
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
