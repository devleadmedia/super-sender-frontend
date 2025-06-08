import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ChatSMS from 'src/services/sms/chat/chatSMS.service'
import { cloneDeep } from 'src/utils/clone.util'
import { QInfiniteScroll } from 'quasar'
import { initState, dialog, IState, loader } from './chatSMS.const'
import { IContactChatSMS } from 'src/types/sms/IChatSMS.type'

const infiniteScroll = ref<QInfiniteScroll | null>(null)

const state = ref<IState>(cloneDeep(initState))

export function useChatSMS() {
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await ChatSMS.getAllContacts()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os usuários',
      loaders: [loader.list],
    })
  }

  async function sendMessage() {
    await requester.dispatch({
      callback: async () => {
        if (!state.value.chat) throw new Error('Not data user')

        const response = await ChatSMS.sendMessage(
          state.value.chat.contact.id,
          state.value.chat.currentMessage,
        )

        state.value.chat.messagens.push(response)
      },
      successCallback: () => {
        scrollToBottom()
        clearSender()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível enviar a mensagem',
      loaders: [loader.sendMessage],
    })
  }

  async function getMessageById(contactId: string) {
    await requester.dispatch({
      callback: async () => {
        if (!state.value.chat) throw new Error('Not data user')

        const response = await ChatSMS.getMessageById(contactId)
        state.value.chat.messagens = response
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível enviar a mensagem',
      loaders: [loader.getMessagens],
    })
  }

  async function openChat(contact: IContactChatSMS) {
    if (contact.id === state.value.chat?.contact.id) return

    state.value.chat = {
      contact: contact,
      currentMessage: '',
      messagens: [],
      search: '',
    }

    await getMessageById(contact.id)
  }

  function scrollToBottom() {
    const infiniteScrollHTML = infiniteScroll.value?.$el as HTMLDivElement

    infiniteScrollHTML.scroll({
      behavior: 'smooth',
      top: infiniteScrollHTML.scrollHeight,
    })
  }

  function clearSender() {
    state.value.chat = cloneDeep(initState.chat)
  }

  function isActiveOption(value: 'all' | 'unRead' | 'favorites') {
    return state.value.sidebar.filterBy === value ? 'primary' : 'accent'
  }

  function setFilterByOption(value: 'all' | 'unRead' | 'favorites') {
    console.log('VAP')
    state.value.sidebar.filterBy = value
  }

  return {
    state,
    dialog,
    loader,
    infiniteScroll,
    openChat,
    fetchList,
    sendMessage,
    toggleDialog,
    createDialog,
    loaderStatus,
    scrollToBottom,
    isActiveOption,
    getMessageById,
    setFilterByOption,
  }
}
