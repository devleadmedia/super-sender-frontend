import type { QTableColumn } from 'quasar'
import { rolesDictionary } from 'src/constants/roles.const'
import { shootingPermissionsDictionary } from 'src/constants/shot/shootingPermissions.const'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPermissions<T>(value: Array<T>, dictionary: any) {
  const roles = value
    .map((role: T) => dictionary[role].name)
    .slice(0, 3)
    .join(', ')
  return `${roles}${value.length > 4 ? ` (+${value.length - 3})` : ''}`
}

export const userTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Email',
    field: 'email',
    name: 'email',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Saldo',
    field: 'balance',
    name: 'balance',
    sortable: true,
    align: 'left',
    format: (v) =>
      v.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    label: 'Tipo de usuário',
    field: 'roles',
    name: 'roles',
    sortable: true,
    align: 'left',
    format: (v) => formatPermissions(v, rolesDictionary),
  },
  {
    label: 'Permissões de disparo',
    field: 'shootingPermissions',
    name: 'shootingPermissions',
    sortable: true,
    align: 'left',
    format: (v) => formatPermissions(v, shootingPermissionsDictionary),
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
