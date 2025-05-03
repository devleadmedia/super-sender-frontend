import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import type { IContactSMS } from 'src/types/sms/IContactSMS.type'
import { random } from 'lodash'

export async function getAll(): Promise<IContactSMS[]> {
  /* const { data } = await api.get('/contact/sms/table')
  return data */

  await fakePromise(1000)

  const data: IContactSMS[] = []

  for (let idx = 0; idx < 100; idx++) {
    data.push({
      title: `Lista de contatos #${idx}`,
      id: `${idx}`,
      quantityContacts: random(0, 500, true),
      status: Status.active,
      client: {
        id: `${idx}`,
        name: `Nome ${idx}`,
      },
    })
  }

  return data
}

export async function create(title: string) {
  await api.post('/contact/sms', {
    title,
  })
}

export async function save(id: string, title: string, status: Status) {
  await api.put(`/contact/sms/${id}`, {
    title,
    status,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/contact/sms/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/contact/sms/disable', {
    ids,
  })
}

export async function exportItem(id: string): Promise<File> {
  await fakePromise(1000)

  const { data } = await api.post(`/contact/sms/export/${id}`)
  return data
}
