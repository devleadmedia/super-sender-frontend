import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ChatSMS from 'src/services/sms/chat/chatSMS.service'
import * as TriggerWordsSMS from 'src/services/sms/trigger-word/triggerWord.service'
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
        const [triggerWords, list] = await Promise.all([
          await TriggerWordsSMS.getAll(),
          await ChatSMS.getAllContacts(),
        ])

        state.value.triggerWords = triggerWords
        state.value.list = list
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

        state.value.chat.totalCredits = await ChatSMS.sendMessage(
          state.value.chat.contact.id,
          state.value.chat.currentMessage,
        )
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível enviar a mensagem',
      loaders: [loader.sendMessage],
    })
  }

  async function confirmSendMessage() {
    await requester.dispatch({
      callback: async () => {
        if (!state.value.chat) throw new Error('Not data user')

        const response = await ChatSMS.confirmSendMessage(
          state.value.chat.contact.id,
          state.value.chat.currentMessage,
        )

        state.value.chat.messagens.push(response)
      },
      successCallback: () => {
        scrollToBottom()
        cancelSendMessage()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível enviar a mensagem',
      loaders: [loader.confirmSendMessage],
    })
  }

  async function favoriteChat(contactId: string) {
    await requester.dispatch({
      callback: async () => {
        await ChatSMS.favorite(contactId)
      },
      successCallback: () => {
        const idx = state.value.list.findIndex(
          (item) => item.contactId == contactId,
        )

        const favorite = !state.value.list[idx]!.favorite

        state.value.list[idx]!.favorite = favorite
        state.value.chat!.contact.favorite = favorite
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível favoritar a mensagem',
      loaders: [loader.favorite],
    })
  }

  async function deleteChat(contactId: string) {
    await requester.dispatch({
      callback: async () => {
        await ChatSMS.deleteItem(contactId)
      },
      successCallback: () => {
        state.value.list = state.value.list.filter(
          (item) => item.contactId != contactId,
        )

        if (state.value.chat?.contact.contactId == contactId)
          state.value.chat = null

        toggleDialog(dialog.delete)
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível deletar a mensagem',
      loaders: [loader.delete],
    })
  }

  async function getMessageById(contactId: string) {
    await requester.dispatch({
      callback: async () => {
        if (!state.value.chat) throw new Error('Not data user')

        const response = await ChatSMS.getMessageById(contactId)
        state.value.chat.messagens = response
      },
      successCallback: () => {
        const idx = state.value.list.findIndex(
          (item) => item.contactId === contactId,
        )
        state.value.list[idx]!.newMessagens = 0
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
      totalCredits: null,
      errors: 0,
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

  function isActiveOption(value: 'all' | 'unRead' | 'favorites') {
    return state.value.sidebar.filterBy === value ? 'primary' : 'accent'
  }

  function setFilterByOption(value: 'all' | 'unRead' | 'favorites') {
    state.value.sidebar.filterBy = value
  }

  function cancelSendMessage() {
    state.value.chat!.currentMessage = ''
    state.value.chat!.totalCredits = null
  }

  function resetState() {
    state.value = cloneDeep(initState)
  }

  function openDeleteDialog(contact: IContactChatSMS) {
    state.value.actionData = contact
    toggleDialog(dialog.delete)
  }

  return {
    state,
    dialog,
    loader,
    infiniteScroll,
    openChat,
    fetchList,
    deleteChat,
    resetState,
    sendMessage,
    toggleDialog,
    favoriteChat,
    createDialog,
    loaderStatus,
    scrollToBottom,
    isActiveOption,
    getMessageById,
    openDeleteDialog,
    setFilterByOption,
    cancelSendMessage,
    confirmSendMessage,
  }
}
