import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import type { ISenderByClient } from 'src/types/sender/ISenderByClient.type'

export async function getAll(): Promise<ISenderByClient[]> {
  /* const { data } = await httpClientAxios.get('/senderForClient/table')
  return data */

  await fakePromise(1000)
  return [
    {
      id: '1',
      status: Status.active,
      client: {
        id: '1',
        name: 'Nome 1',
      },
      senderIds: ['0', '1', '3', '2'],
    },
  ]
}

export async function create(clientId: string, senderIds: string[]) {
  await httpClientAxios.post('/senderForClient', { clientId, senderIds })
}

export async function save(
  id: string,
  status: Status,
  clientId: string,
  senderIds: string[],
) {
  await httpClientAxios.put(`/senderForClient/${id}`, {
    status,
    clientId,
    senderIds,
  })
}

export async function deleteItem(ids: string[]) {
  await httpClientAxios.delete(`/senderForClient/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await httpClientAxios.patch('/senderForClient/disable', {
    ids,
  })
}
