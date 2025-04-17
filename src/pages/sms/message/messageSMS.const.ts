import type { QTableColumn } from 'quasar'

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
