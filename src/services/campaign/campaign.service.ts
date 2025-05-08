import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import { ICampaign } from 'src/types/campaign/ICampaign.type'

export async function getAll(): Promise<ICampaign[]> {
  /* const { data } = await api.get('/campaign')
  return data */

  await fakePromise(1000)

  const data: ICampaign[] = []

  for (let idx = 0; idx < 500; ++idx) {
    data.push({
      id: `${idx}`,
      menssageIds: ['0', '1', '2'],
      name: `${idx}# Nome da campanha`,
      status: Status.active,
    })
  }

  return data
}

export async function create(
  name: string,
  status: Status,
  menssageIds: string[],
) {
  await api.post('/campaign/', { name, status, menssageIds })
}

export async function save(
  id: string,
  name: string,
  status: Status,
  menssageIds: string[],
) {
  await api.put(`/campaign/${id}`, {
    name,
    status,
    menssageIds,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/campaign/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/campaign/disable', {
    ids,
  })
}
