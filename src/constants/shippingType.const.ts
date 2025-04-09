import { ShippingType } from 'src/enums/ShippingType.enum'

export const shippingTypeOptions = [
  { name: 'SMS', value: ShippingType.sms },
  { name: 'Email', value: ShippingType.email },
  { name: 'Whatsapp', value: ShippingType.whatsapp },
]

type IDictionary = {
  [key in ShippingType]: {
    name: string
    icon: string
  }
}

export const shippingTypeDictionary: IDictionary = {
  [ShippingType.sms]: { name: 'SMS', icon: 'sms' },
  [ShippingType.email]: { name: 'Email', icon: 'mail' },
  [ShippingType.whatsapp]: { name: 'Whatsapp', icon: 'phone' },
}
