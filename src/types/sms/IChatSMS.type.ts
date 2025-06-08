export interface IContactChatSMS {
  id: string
  contactId: string
  telephone: string
  lastMessage: string
  lastMessageDate: string
  favorite: boolean
  newMessagens: number
}

export interface IMessageChatSMS {
  id: string
  message: string
  contactId: string
  date: string
}
