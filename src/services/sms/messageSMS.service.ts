import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import type { Status } from 'src/enums/Status.enum'
import { random } from 'lodash'
import type { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { statusOptions } from 'src/constants/status.const'

export async function getAll(): Promise<IMessageSMS[]> {
  /* const { data } = await api.get('/message/sms/table')
  return data */

  await fakePromise(1000)

  const data: IMessageSMS[] = []

  for (let idx = 0; idx < 100; idx++) {
    data.push({
      id: `${idx}`,
      title: `Titulo de  #${idx}`,
      status: statusOptions[random(0, 1, false)]!.value,
      message: `Mensagem de alguma coisa ${idx}`,
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
