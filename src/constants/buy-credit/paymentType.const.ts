import { PaymentType } from 'src/enums/buy-credit/PaymentType.enum'

export const paymentTypeOptions = [
  {
    value: PaymentType.credit,
    name: 'Crédito',
  },
  {
    value: PaymentType.pix,
    name: 'PIX',
  },
]

type IDictionary = {
  [key in PaymentType]: { name: string }
}

export const paymentTypeDictionary: IDictionary = {
  [PaymentType.credit]: { name: 'Crédito' },
  [PaymentType.pix]: { name: 'PIX' },
}
