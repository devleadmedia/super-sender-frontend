import { ShippingStatusSMS } from 'src/enums/shipping/ShippingStatusSMS.enum'

export const shippingStatusDictionary = {
  [ShippingStatusSMS.noSent]: {
    name: 'Não enviado',
    icon: 'cancel',
  },
  [ShippingStatusSMS.sent]: {
    name: 'Enviado',
    icon: 'done',
  },
  [ShippingStatusSMS.received]: {
    name: 'Recebido',
    icon: 'done_all',
  },
  [ShippingStatusSMS.read]: {
    name: 'Lido',
    icon: 'done_all',
  },
}

export const shippingStatusOptions = [
  { name: 'Não enviado', value: ShippingStatusSMS.noSent },
  { name: 'Lido', value: ShippingStatusSMS.read },
  { name: 'Recebido', value: ShippingStatusSMS.received },
  { name: 'Enviado', value: ShippingStatusSMS.sent },
]
