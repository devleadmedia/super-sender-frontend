import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { IMessageSupport, ISupport } from 'src/types/support/ISupport.type'
import { SupportStatus } from 'src/enums/support/SupportStatus.enum'
import { random } from 'lodash'

export async function getAll(): Promise<ISupport[]> {
  /* const { data } = await api.get('/support')
  return data */

  await fakePromise(1000)

  const data: ISupport[] = []

  for (let idx = 0; idx < 100; idx++) {
    data.push({
      id: `${idx}`,
      date: new Date().toISOString(),
      status: [
        SupportStatus.pending,
        SupportStatus.cancel,
        SupportStatus.resolved,
      ][random(0, 2, false)]!,
      title: `Titulo do chamado - ${idx}`,
      description: `Descrição do chamado ${idx}`,
      requester: {
        id: `${idx}`,
        name: `Nome ${idx}`,
      },
      messages: [
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem do chamado de alguma coisa #${idx}`,
          userId: `${idx}`,
          images: [],
        },
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem do chamado de alguma coisa #${idx}`,
          userId: `${idx + 1}`,
          images: [],
        },
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem do chamado de alguma coisa #${idx}`,
          userId: `${idx}`,
          images: [],
        },
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem do chamado de alguma coisa #${idx}`,
          userId: `${idx}`,
          images: [],
        },
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem do chamado de alguma coisa #${idx}`,
          userId: `${idx + 1}`,
          images: [],
        },
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem de imagem de chamado de alguma coisa #${idx}`,
          userId: `${idx + 1}`,
          images: [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJup8jWrmQi33yaNOfMvJUa7ZCtPBwShI5g&s',
          ],
        },
        {
          id: `${idx}`,
          date: new Date().toISOString(),
          message: `Mensagem de imagem de chamado de alguma coisa #${idx}`,
          userId: `${idx}`,
          images: [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJup8jWrmQi33yaNOfMvJUa7ZCtPBwShI5g&s',
          ],
        },
      ],
    })
  }

  return data
}

export async function create(
  title: string,
  description: string,
  files: File[],
) {
  const formData = new FormData()

  formData.append('title', title)
  formData.append('description', description)

  for (let idx = 0; idx < files.length; idx++) {
    formData.append('files', files[idx] as File)
  }

  await api.post('/support', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function sendMessage(
  id: string,
  message: string,
  files: File[],
): Promise<IMessageSupport> {
  const formData = new FormData()

  await fakePromise(2000)

  formData.append('message', message)

  for (let idx = 0; idx < files.length; idx++) {
    formData.append('files', files[idx] as File)
  }

  /* const { data } = await api.post(`/support/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) */

  return {
    date: new Date().toISOString(),
    id: id + 1,
    images: [],
    message: 'Mensagem de teste enviada',
    userId: '0',
  }
}

export async function deleteItem(ids: string[]) {
  await fakePromise(1500)
  await api.delete(`/support/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await fakePromise(1500)
  await api.patch('/support/disable', {
    ids,
  })
}

export async function updateStatus(id: string, status: SupportStatus) {
  await fakePromise(1500)
  await api.put(`/support/status/${id}`, { status })
}
