import { Roles } from 'src/enums/Roles.enum'

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
    icon: 'campaign',
    name: 'Campanhas',
    separator: false,
    to: { name: 'campaign' },
    roles: [],
    children: [],
  },
  {
    icon: 'message',
    name: 'SMS',
    separator: false,
    to: { name: '' },
    roles: [],
    children: [
      {
        icon: '',
        name: 'Templates de mensagem',
        separator: false,
        to: { name: 'messageSMS' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Contatos',
        separator: false,
        to: { name: 'contactSMS' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Disparos',
        separator: false,
        to: { name: 'shootingSMS' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Chat',
        separator: false,
        to: { name: 'chatSMS' },
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
    to: { name: '' },
    roles: [],
    children: [
      {
        icon: '',
        name: 'Templates de mensagem',
        separator: false,
        to: { name: 'messageWhatsapp' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Contatos',
        separator: false,
        to: { name: 'contactWhatsapp' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Disparos',
        separator: false,
        to: { name: 'shootingWhatsapp' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Chat',
        separator: false,
        to: { name: 'chatWhatsapp' },
        roles: [],
        children: [],
      },
    ],
  },
  {
    icon: 'local_atm',
    name: 'Preços',
    separator: false,
    to: { name: '' },
    roles: [],
    children: [
      {
        icon: '',
        name: 'Gerenciar preços',
        separator: false,
        to: { name: 'priceManagement' },
        roles: [Roles.admin],
        children: [],
      },
      {
        icon: '',
        name: 'Tabela de preços',
        separator: false,
        to: { name: 'tablePrice' },
        roles: [],
        children: [],
      },
    ],
  },
  {
    icon: 'account_circle',
    name: 'Perfil',
    separator: false,
    to: { name: 'profile' },
    roles: [],
    children: [
      {
        icon: '',
        name: 'Meus dados',
        separator: false,
        to: { name: 'profile' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Extrato',
        separator: false,
        to: { name: 'statement' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Comprar créditos',
        separator: false,
        to: { name: 'buyCredit' },
        roles: [],
        children: [],
      },
    ],
  },
  {
    icon: 'manage_accounts',
    name: 'Remetentes',
    separator: false,
    to: { name: '' },
    roles: [Roles.admin],
    children: [
      {
        icon: '',
        name: 'Gerenciar remetentes',
        separator: false,
        to: { name: 'senderManagement' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Remetentes por cliente',
        separator: false,
        to: { name: 'senderByClient' },
        roles: [],
        children: [],
      },
    ],
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
