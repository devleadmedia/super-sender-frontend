import { Roles } from 'src/enums/Roles.enum'

export const menuOptions = [
  {
    icon: 'message',
    name: 'Mensagens',
    separator: false,
    to: { name: 'site' },
    roles: [Roles.admin, Roles.client],
  },
  {
    icon: 'contacts',
    name: 'Contatos',
    separator: false,
    to: { name: 'site' },
    roles: [],
  },
  {
    icon: 'send',
    name: 'Disparos',
    separator: true,
    to: { name: 'site' },
    roles: [],
  },
  {
    icon: 'price_change',
    name: 'Gerenciar preços',
    separator: false,
    to: { name: 'priceManagement' },
    roles: [],
  },
  {
    icon: 'manage_accounts',
    name: 'Remetentes',
    separator: false,
    to: { name: 'site' },
    roles: [],
  },
  {
    icon: 'people',
    name: 'Usuários',
    separator: true,
    to: { name: 'user' },
    roles: [],
  },
  {
    icon: 'local_atm',
    name: 'Preços',
    separator: false,
    to: { name: 'tablePrice' },
    roles: [],
  },
  {
    icon: 'schedule',
    name: 'Extrato',
    separator: false,
    to: { name: 'historic' },
    roles: [],
  },
  {
    icon: 'account_balance_wallet',
    name: 'Minha carteira',
    separator: false,
    to: { name: 'myWallet' },
    roles: [],
  },
  {
    icon: 'account_circle',
    name: 'Perfil',
    separator: false,
    to: { name: 'profile' },
    roles: [],
  },
]
