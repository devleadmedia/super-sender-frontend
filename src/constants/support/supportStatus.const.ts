import { SupportStatus } from 'src/enums/support/SupportStatus.enum'

export const supportStatusDictionary = {
  [SupportStatus.pending]: {
    name: 'Pendente',
    color: 'red',
  },
  [SupportStatus.resolved]: {
    name: 'Resolvido',
    color: 'green',
  },
  [SupportStatus.cancel]: {
    name: 'Cancelado',
    color: 'grey',
  },
}

export const supportStatusOptions = [
  {
    name: 'Pendente',
    color: 'red',
    value: SupportStatus.pending,
  },
  {
    name: 'Resolvido',
    color: 'green',
    value: SupportStatus.resolved,
  },
  {
    name: 'Cancelado',
    color: 'grey',
    value: SupportStatus.cancel,
  },
]
