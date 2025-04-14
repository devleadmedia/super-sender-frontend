import type { QTableColumn } from 'quasar'

export const senderByClientTableColumns: QTableColumn[] = [
  {
    label: 'Cliente',
    field: (row) => row.client.name,
    name: 'client',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Número de remetentes',
    field: (row) => row.senderIds.length,
    name: 'senderIds',
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

export const associationTableColumns: QTableColumn[] = [
  {
    label: 'DDD',
    field: 'ddd',
    name: 'ddd',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Número',
    field: 'number',
    name: 'number',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Operadora',
    field: 'operator',
    name: 'operator',
    sortable: true,
    align: 'left',
  },
]
