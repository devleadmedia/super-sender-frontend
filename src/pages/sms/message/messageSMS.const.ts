import type { QTableColumn } from 'quasar'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { Status } from 'src/enums/Status.enum'
import { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { ITriggerWord } from 'src/types/sms/ITriggerWord.type'
import { IUser } from 'src/types/user/IUser.type'

export interface IState {
  options: {
    clients: IUser[]
    alternativeMessages: string[]
  }
  form: {
    id: string
    title: string
    message: string
    status: Status
    isAlternativeMessages: boolean
    alternativeMessages: string[]
  }
  list: IMessageSMS[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: IMessageSMS[]
  triggerWords: ITriggerWord[]
  hasErrorMessage: boolean
}

export const initState: IState = {
  form: {
    id: '',
    title: '',
    status: Status.active,
    message: '',
    alternativeMessages: [],
    isAlternativeMessages: false,
  },
  options: {
    clients: [],
    alternativeMessages: [],
  },
  actionsData: [],
  actionType: ActionDialogOptions.delete,
  filter: '',
  list: [],
  triggerWords: [],
  hasErrorMessage: false,
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
