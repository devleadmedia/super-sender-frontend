import type { QTableColumn } from 'quasar'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { SupportStatus } from 'src/enums/support/SupportStatus.enum'
import { IBasicEntity } from 'src/types/IBasicEntity.type'
import { IMessageSupport, ISupport } from 'src/types/support/ISupport.type'
import { IUser } from 'src/types/user/IUser.type'
import { formatDate } from 'src/utils/date.util'

export const LIMIT_MB = 2
export const MAX_LIMIT_MB = 10

export interface IState {
  options: {
    clients: IUser[]
  }
  openRequestForm: {
    title: string
    description: string
    files: File[] | null
  }
  form: {
    id: string
    title: string
    description: string
    status: SupportStatus
    requester: IBasicEntity<string>
    messages: IMessageSupport[]
    date: string
    currentMessage: string
    files: File[]
    previews: string[]
  }
  list: ISupport[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISupport[]
}

export const initState: IState = {
  openRequestForm: {
    title: '',
    description: '',
    files: [],
  },
  form: {
    id: '',
    requester: {
      id: '',
      name: '',
    },
    previews: [],
    title: '',
    description: '',
    status: SupportStatus.cancel,
    messages: [],
    currentMessage: '',
    date: '',
    files: [],
  },
  options: {
    clients: [],
  },
  actionsData: [],
  actionType: ActionDialogOptions.delete,
  filter: '',
  list: [],
}

export const dialog = {
  edit: 'edit-1e12f342f',
  openRequest: 'openRequest-1f34g34g9k',
  action: 'action-f3223f',
}

export const loader = {
  list: 'list-1e12f342f',
  openRequest: 'openRequest-1f34g34g9k',
  edit: 'edit-1e12f342f',
  action: 'action-f3223f',
  downloadContact: 'downloadContact-f3223f',
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
