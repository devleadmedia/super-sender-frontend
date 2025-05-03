import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import type { Status } from 'src/enums/Status.enum'
import { random } from 'lodash'
import type { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { statusOptions } from 'src/constants/status.const'

export async function getAll(): Promise<IMessageSMS[]> {
  /* const { data } = await api.get('/message/sms/table')
  return data */

  await fakePromise(1)

  const data: IMessageSMS[] = []

  for (let idx = 0; idx < 20; idx++) {
    data.push({
      id: `${idx}`,
      title: `Titulo de  #${idx}`,
      status: statusOptions[random(0, 1, false)]!.value,
      message: `Mensagem de alguma coisa ${idx}`,
      alternativeMessages: [
        'Ao contrario da crenca popular, o Lorem Ipsum nao é simplesmente texto aleatorio. Tem raizes numa peca de literatura classica em Latim, de 45 AC.',
      ],
    })
  }

  return data
}

export async function create(title: string, message: string) {
  await api.post('/message/sms', {
    title,
    message,
  })
}

export async function save(
  id: string,
  title: string,
  message: string,
  status: Status,
) {
  await api.put(`/message/sms/${id}`, {
    title,
    message,
    status,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/message/sms/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/message/sms/disable', {
    ids,
  })
}

export async function getAlternativeMessages(text: string): Promise<string[]> {
  /* const { data } = await api.post('/message/sms/alternative-messages', {
    text,
  }) */

  await fakePromise(1)

  const data: string[] = []

  for (let idx = 0; idx < 15; idx++) {
    data.push(
      `#${idx} Ao contrario da crenca popular, o Lorem Ipsum nao é simplesmente texto aleatorio. Tem raizes numa peca de literatura classica em Latim, de 45 AC.`,
    )
  }

  console.log(text)

  return data
}
