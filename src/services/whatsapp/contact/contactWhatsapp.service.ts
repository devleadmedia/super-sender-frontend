import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import { random } from 'lodash'
import { IContactWhatsapp } from 'src/types/whatsapp/IContactWhatsapp.type'

export async function getAll(): Promise<IContactWhatsapp[]> {
  /* const { data } = await httpClientAxios.get('/contact/whatsapp/table')
  return data */

  await fakePromise(1000)

  const data: IContactWhatsapp[] = []

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
  await httpClientAxios.post('/contact/whatsapp', {
    title,
  })
}

export async function save(id: string, title: string, status: Status) {
  await httpClientAxios.put(`/contact/whatsapp/${id}`, {
    title,
    status,
  })
}

export async function deleteItem(ids: string[]) {
  await httpClientAxios.delete(`/contact/whatsapp/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await httpClientAxios.patch('/contact/whatsapp/disable', {
    ids,
  })
}

export async function exportItem(id: string): Promise<File> {
  await fakePromise(1000)

  const { data } = await httpClientAxios.post<File>(
    `/contact/whatsapp/export/${id}`,
  )
  return data
}
