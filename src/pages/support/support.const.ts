import type { QTableColumn } from 'quasar'
import { formatDate } from 'src/utils/date.util'

export const LIMIT_MB = 2
export const MAX_LIMIT_MB = 10

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
