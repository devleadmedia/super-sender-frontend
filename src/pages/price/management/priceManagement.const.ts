import type { QTableColumn } from 'quasar'
import type { IState } from './usePriceManagement'
import { ShippingType } from 'src/enums/ShippingType.enum'
import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import { Status } from 'src/enums/Status.enum'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

export const initState: IState = {
  form: {
    shippingType: [],
    shippingTypeStep: ShippingType.sms,
    tablePriceSMS: [
      {
        name: 'Novo',
        data: [
          {
            typeRoute: TypeRouteSMS.shortCode,
            typeShot: TypeShotSMS.oneWay,
            typeSMS: TypeSMS.flash,
            value: 0,
          },
        ],
      },
    ],
    tablePriceEmail: [],
    tablePriceWhatsapp: [],
    id: '',
    client: '',
    status: Status.active,
  },
  options: {
    clients: [],
  },
  visiblePassword: false,
  alterPassword: false,
  actionsData: [],
  actionType: ActionDialogOptions.delete,
  filter: '',
  list: [],
}

export const dialog = {
  edit: 'edit-1e12f342f',
  action: 'action-f3223f',
}

export const loader = {
  list: 'list-1e12f342f',
  edit: 'edit-1e12f342f',
  action: 'action-f3223f',
}

export const priceManagementTableColumns: QTableColumn[] = [
  {
    label: 'Cliente',
    field: (row) => row.client.name,
    name: 'client',
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
