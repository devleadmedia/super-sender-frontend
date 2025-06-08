import { api } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import type {
  IContactChatSMS,
  IMessageChatSMS,
} from 'src/types/sms/IChatSMS.type'
import { random } from 'lodash'

export async function sendMessage(
  id: string,
  message: string,
): Promise<IMessageChatSMS> {
  const { data } = await api.post(`/chat/sms/${id}`, { message })

  return data
}

export async function getMessageById(
  userId: string,
): Promise<IMessageChatSMS[]> {
  // const { data } = await api.get(`/chat/message/sms/${userId}`)

  await fakePromise(2000)

  const data: IMessageChatSMS[] = []

  for (let idx = 0; idx < 50; idx++) {
    const date = new Date()
    date.setDate(date.getDate() + idx)

    data.push({
      contactId: userId,
      date: date.toISOString(),
      id: `${idx}`,
      message: `Mensagem de um usuario para outro #${idx}`,
    })

    data.push({
      contactId: `${idx}`,
      date: date.toISOString(),
      id: `${idx}`,
      message: `Mensagem de um usuario para outro #${idx}`,
    })
  }
  return data
}

export async function getAllContacts(): Promise<IContactChatSMS[]> {
  await fakePromise(1000)
  // const { data } = await api.get('/chat/contact/sms')

  const data: IContactChatSMS[] = []

  for (let idx = 0; idx < 100; idx++) {
    const date = new Date()
    date.setDate(date.getDate() + idx)

    data.push({
      id: `${idx}`,
      telephone: `${random(10000000000, 99999999999)}`,
      lastMessage: `Ultima mensagem do usuario sad asda sd asda sdas das${idx}`,
      lastMessageDate: date.toISOString(),
      favorite: random(1, 2) % 2 === 0,
      newMessagens: random(0, 4),
      contactId: `${idx}`,
    })
  }

  return data
}
