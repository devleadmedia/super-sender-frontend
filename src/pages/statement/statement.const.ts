import type { QTableColumn } from 'quasar'

/*
  id: string
  description: string
  date: string
  type: ShippingType
  value: number
*/

export const statementTableColumns: QTableColumn[] = [
  {
    label: 'Descrição',
    field: 'description',
    name: 'description',
    sortable: true,
    align: 'left',
  },
]
