// import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import type {
  IContactChatSMS,
  IMessageChatSMS,
} from 'src/types/sms/IChatSMS.type'
import { random } from 'lodash'

export async function sendMessage(
  id: string,
  message: string,
): Promise<number> {
  await fakePromise(1000)
  // const { data } = await httpClientAxios.post(`/chat/sms/${id}`, { message })

  console.log(`Enviando mensagem para o contato ${id}: ${message}`)

  return 12 // Simulando o retorno de créditos restantes
}

export async function confirmSendMessage(
  id: string,
  message: string,
): Promise<IMessageChatSMS> {
  await fakePromise(1000)

  // const { data } = await httpClientAxios.post(`/chat/sms/confirm/${id}`, { message })

  console.log(`Confirmando envio da mensagem para o contato ${id}: ${message}`)
  return {
    contactId: id,
    date: new Date().toISOString(),
    id: `${random(1000, 9999)}`,
    message,
  } // Simulando uma mensagem confirmada
}

export async function getMessageById(
  contactId: string,
): Promise<IMessageChatSMS[]> {
  /* const { data } = await httpClientAxios.get<IMessageChatSMS[]>(
    `/chat/message/sms/${contactId}`,
    {
      cancelPrevious: true,
    },
  ) */
  await fakePromise(1000)

  const data: IMessageChatSMS[] = []

  for (let idx = 0; idx < 50; idx++) {
    const date = new Date()
    date.setDate(date.getDate() + idx)

    data.push({
      contactId,
      date: date.toISOString(),
      id: `${idx}`,
      message: `U${contactId} Mensagem de um usuario para outro #${idx}`,
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

export async function favorite(contactId: string): Promise<void> {
  await fakePromise(1000)
  console.log(contactId)
  // await httpClientAxios.put(`/chat/contact/sms/favorite/${contactId}`)
}

export async function deleteItem(contactId: string): Promise<void> {
  await fakePromise(1000)
  console.log(contactId)
  // await httpClientAxios.delete(`/chat/contact/sms/delete/${contactId}`)
}

export async function getAllContacts(): Promise<IContactChatSMS[]> {
  await fakePromise(1000)
  // const { data } = await httpClientAxios.get('/chat/contact/sms')

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
