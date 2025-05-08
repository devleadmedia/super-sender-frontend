import type { QTableColumn } from 'quasar'
import { useRoles } from 'src/composables/useRoles'

import {
  typeRouteSMSDictionary,
  typeShotSMSDictionary,
  typeSMSDictionary,
} from 'src/constants/shot/typesShot.const'
import type {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import { formatDate } from 'src/utils/date.util'

const { isAdmin } = useRoles()

const columnsAdmin: QTableColumn[] = isAdmin()
  ? [
      {
        label: 'Cliente',
        field: (v) => v.user.name,
        name: 'user',
        sortable: true,
        align: 'left',
      },
    ]
  : []

export const shootingSMSTableColumns: QTableColumn[] = [
  {
    label: 'Id',
    field: 'id',
    name: 'id',
    sortable: true,
    align: 'left',
  },
  ...columnsAdmin,
  {
    label: 'Data',
    field: 'date',
    name: 'date',
    format: (v) => formatDate(v),
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
  {
    label: 'Tipo disparo',
    field: 'typeShot',
    name: 'typeShot',
    sortable: true,
    align: 'left',
    format: (v) => typeShotSMSDictionary[v as TypeShotSMS].name,
  },
  {
    label: 'Tipo SMS',
    field: 'typeSMS',
    name: 'typeSMS',
    sortable: true,
    align: 'left',
    format: (v) => typeSMSDictionary[v as TypeSMS].name,
  },
  {
    label: 'Rota',
    field: 'typeRoute',
    name: 'typeRoute',
    sortable: true,
    align: 'left',
    format: (v) => typeRouteSMSDictionary[v as TypeRouteSMS].name,
  },
  {
    label: 'Status',
    field: 'status',
    name: 'status',
    sortable: true,
    align: 'center',
  },
  {
    label: 'Campanha',
    field: 'campaign',
    name: 'campaign',
    sortable: true,
    align: 'left',
    format: (v) => v.name,
  },
  {
    label: 'Lista de contatos',
    field: 'contactIds',
    name: 'contactIds',
    sortable: true,
    align: 'left',
    format: (v) => v.length,
  },
  {
    label: 'Ações',
    field: 'actions',
    name: 'actions',
    align: 'left',
  },
]

export const shippingSMSTableColumns: QTableColumn[] = [
  {
    label: 'id',
    field: 'id',
    name: 'id',
    sortable: true,
    align: 'left',
  },
  {
    label: 'DDD',
    field: 'ddd',
    name: 'ddd',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Destinatário',
    field: 'phoneNumber',
    name: 'phoneNumber',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Operadora',
    field: 'operatorName',
    name: 'operatorName',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Remetente',
    field: 'sender',
    name: 'sender',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Caracteres',
    field: 'totalCharacters',
    name: 'totalCharacters',
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
