import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import type { ISender } from 'src/types/sender/ISender.type'
import { random } from 'lodash'

export async function getAll(): Promise<ISender[]> {
  /* const { data } = await httpClientAxios.get('/sender')
  return data */

  await fakePromise(1000)

  const data: ISender[] = []

  for (let idx = 0; idx < 500; ++idx) {
    data.push({
      id: `${idx}`,
      status: Status.active,
      ddd: `${random(10, 80, false)}`,
      number: `9${random(10000000, 99999999, false)}`,
      operator: 'TIM',
    })
  }

  return data
}

export async function create(file: File) {
  const formData = new FormData()

  formData.append('file', file)

  await httpClientAxios.post('/sender/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  ddd: string,
  number: string,
  operator: string,
) {
  await httpClientAxios.put(`/sender/${id}`, {
    ddd,
    number,
    operator,
  })
}

export async function deleteItem(ids: string[]) {
  await httpClientAxios.delete(`/sender/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await httpClientAxios.patch('/sender/disable', {
    ids,
  })
}
