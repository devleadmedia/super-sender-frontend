// import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { random } from 'lodash'
import type { IShippingSMS } from 'src/types/sms/IShippingSMS.type'
import { shippingStatusOptions } from 'src/constants/shipping/shippingStatusSMS.const'
import { ShippingStatusSMS } from 'src/enums/shipping/ShippingStatusSMS.enum'

export async function getAll(
  shootingId: string,
  search: string,
  code: number[],
  carrier: number[],
  status: ShippingStatusSMS[],
  reply?: boolean,
): Promise<IShippingSMS[]> {
  /* const { data } = await api.get(`/shipping/sms/${shootingId}`, {
    data: {
      search,
      code,
      carrier,
      status,
      reply,
    },
  })
  return data */

  await fakePromise(1000)

  const data: IShippingSMS[] = []

  for (let idx = 0; idx < 100; idx++) {
    const replies = [
      {
        id: random(1, 1000, false),
        messageId: random(1, 1000, false),
        shotId: random(1, 1000, false),
        content: `Replica numero ${random(1, 1000, false)}`,
        receivedAt: new Date().toISOString(),
        sender: `${random(10000000, 90000000, false)}`,
      },
      {
        id: random(1, 1000, false),
        messageId: random(1, 1000, false),
        shotId: random(1, 1000, false),
        content: `Replica numero ${random(1, 1000, false)}`,
        receivedAt: new Date().toISOString(),
        sender: `${random(10000000, 90000000, false)}`,
      },
    ]

    data.push({
      id: `${idx}`,
      ddd: `${random(10, 84, false)}`,
      operatorName: ['TIM', 'CLARO', 'OI', 'NEXTELL'][random(0, 3, false)]!,
      calledAt: new Date().toISOString(),
      parts: random(20, 100, false),
      totalCharacters: random(20, 100, false),
      phoneNumber: random(10000000, 90000000, false),
      replies: replies.splice(0, random(0, 2, false)),
      sender: random(10000000, 90000000, false),
      status: shippingStatusOptions[random(0, 3, false)]!.value,
      message: `Mensagem de alguma coisa ${idx}`,
      sentAt: random(0, 1, false) ? new Date().toISOString() : '',
      deliveredAt: random(0, 1, false) ? new Date().toISOString() : '',
    })
  }

  console.log(shootingId, search, code, carrier, status, reply)

  return data
}
