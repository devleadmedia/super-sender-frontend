import type { QTableColumn } from 'quasar'
import { useRoles } from 'src/composables/useRoles'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { Status } from 'src/enums/Status.enum'
import { ICampaign } from 'src/types/campaign/ICampaign.type'
import { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { ITriggerWord } from 'src/types/sms/ITriggerWord.type'
import { IUser } from 'src/types/user/IUser.type'

export interface IState {
  options: {
    clients: IUser[]
    alternativeMessages: string[]
    campaigns: ICampaign[]
  }
  form: {
    id: string
    title: string
    message: string
    campaignId: string
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

const { isAdmin } = useRoles()

export const initState: IState = {
  form: {
    id: '',
    title: '',
    status: Status.active,
    message: '',
    alternativeMessages: [],
    isAlternativeMessages: false,
    campaignId: ''
  },
  options: {
    clients: [],
    alternativeMessages: [],
    campaigns: []
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

export const triggerWordTableColumns: QTableColumn[] = [
  {
    label: 'Id',
    field: 'id',
    name: 'id',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  ...(isAdmin()
    ? [
        {
          label: 'Ações',
          field: 'actions',
          name: 'actions',
          align: 'left',
        } as QTableColumn,
      ]
    : []),
]
