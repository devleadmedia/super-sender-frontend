import type { ShippingType } from 'src/enums/ShippingType.enum'

export interface IStatement {
  id: string
  description: string
  date: string
  type: ShippingType | null
  value: number
}
