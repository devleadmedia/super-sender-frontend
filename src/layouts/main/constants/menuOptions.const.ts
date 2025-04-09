import { useRoles } from 'src/composables/useRoles'
import { Roles } from 'src/enums/Roles.enum'

const { isAdmin } = useRoles()

interface IMenuOptions {
  icon: string
  name: string
  separator: boolean
  to: { name: string }
  roles: Roles[]
  children: IMenuOptions[]
  disable?: boolean
}

export const menuOptions: IMenuOptions[] = [
  {
    icon: 'message',
    name: 'SMS',
    separator: false,
    to: { name: '' },
    roles: [Roles.admin, Roles.client],
    children: [
      {
        icon: 'message',
        name: 'Mensagens',
        separator: false,
        to: { name: 'home' },
        roles: [Roles.admin, Roles.client],
        children: [],
      },
      {
        icon: 'contacts',
        name: 'Contatos',
        separator: false,
        to: { name: 'home' },
        roles: [],
        children: [],
      },
      {
        icon: 'send',
        name: 'Disparos',
        separator: false,
        to: { name: 'home' },
        roles: [],
        children: [],
      },
    ],
  },
  {
    icon: 'mail',
    name: 'Email',
    separator: false,
    disable: true,
    to: { name: 'dsadas' },
    roles: [],
    children: [],
  },
  {
    icon: 'phone',
    name: 'Whatsapp',
    separator: true,
    disable: true,
    to: { name: 'dasd' },
    roles: [],
    children: [],
  },
  {
    icon: 'local_atm',
    name: 'Preços',
    separator: false,
    to: { name: 'tablePrice' },
    roles: [],
    children: [],
  },
  {
    icon: 'schedule',
    name: 'Extrato',
    separator: false,
    to: { name: 'statement' },
    roles: [],
    children: [],
  },
  {
    icon: 'account_circle',
    name: 'Perfil',
    separator: isAdmin(),
    to: { name: 'profile' },
    roles: [],
    children: [],
  },
  {
    icon: 'price_change',
    name: 'Gerenciar preços',
    separator: false,
    to: { name: 'priceManagement' },
    roles: [Roles.admin],
    children: [],
  },
  {
    icon: 'manage_accounts',
    name: 'Remetentes',
    separator: false,
    to: { name: 'site' },
    roles: [Roles.admin],
    children: [],
  },
  {
    icon: 'people',
    name: 'Usuários',
    separator: false,
    to: { name: 'user' },
    roles: [Roles.admin],
    children: [],
  },
]
