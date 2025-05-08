import type { QTableColumn } from 'quasar'

export const campaignTableColumns: QTableColumn[] = [
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
  {
    label: 'N° templates',
    field: 'menssageIds',
    name: 'menssageIds',
    sortable: true,
    align: 'left',
    format: (v) => v.length
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
