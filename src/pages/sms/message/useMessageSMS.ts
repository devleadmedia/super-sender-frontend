import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as MessageSMSService from 'src/services/sms/messageSMS.service'
import * as UserService from 'src/services/user.service'
import * as TriggerWordService from 'src/services/sms/trigger-word/triggerWord.service'
import { cloneDeep } from 'src/utils/clone.util'
import type { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { ITriggerWord } from 'src/types/sms/ITriggerWord.type'
import { initState, IState } from './messageSMS.const'

export function useMessageSMS() {
  const dialog = {
    edit: 'edit-84g34g3',
    triggerWord: 'triggerWord-84g34g3',
    action: 'action-h5h7jf23f',
  }

  const loader = {
    list: 'list-84g34g3',
    edit: 'edit-84g34g3',
    action: 'action-h5h7jf23f',
    triggerWord: 'triggerWord-h5h7jf23f',
    alternativeMessages: 'alternativeMessages-gh34hh56j3',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await MessageSMSService.getAll()

        if (state.value.triggerWords.length == 0) {
          state.value.triggerWords = await TriggerWordService.getAll()
          state.value.options.clients = await UserService.getAll()
        }
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os usuários',
      loaders: [loader.list],
    })
  }

  async function save() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        if (id)
          await MessageSMSService.save(
            id,
            state.value.form.title,
            state.value.form.message,
            state.value.form.status,
          )
        else
          await MessageSMSService.create(
            state.value.form.title,
            state.value.form.message,
          )
      },
      successCallback: async () => {
        await fetchList()
        toggleDialog(dialog.edit)
      },
      successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `Não foi possível ${
        state.value.form.id ? 'editar' : 'salvar'
      }`,
      loaders: [loader.edit],
    })
  }

  async function confirmAction() {
    await requester.dispatch({
      callback: async () => {
        const { actionType } = state.value

        const ids = state.value.actionsData.map((item) => item.id)

        if (actionType == ActionDialogOptions.delete)
          await MessageSMSService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await MessageSMSService.disable(ids)
      },
      successCallback: async () => {
        toggleDialog(dialog.action)
        state.value.actionsData = []
        await fetchList()
      },
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.action],
    })
  }

  async function getAlternativeMessages() {
    await requester.dispatch({
      callback: async () => {
        state.value.options.alternativeMessages =
          await MessageSMSService.getAlternativeMessages(
            state.value.form.message,
          )
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.alternativeMessages],
    })
  }

  function openEditDialog(item?: IMessageSMS) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
        isAlternativeMessages: false,
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function openTriggerDialog() {
    toggleDialog(dialog.triggerWord)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
    state.value.hasErrorMessage = false
    state.value.options.alternativeMessages = []
  }

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  async function triggerWordDelete(word: ITriggerWord) {
    await requester.dispatch({
      callback: async () => {
        await TriggerWordService.deleteItem(word.id)

        state.value.triggerWords = state.value.triggerWords.filter(
          (item) => item.id != word.id,
        )
      },
      successMessageTitle: 'Excluido com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.triggerWord],
    })
  }

  async function triggerWordSave(word: ITriggerWord) {
    await requester.dispatch({
      callback: async () => {
        if (word.id) await TriggerWordService.save(word.id, word.name)
        else await TriggerWordService.create(word.name)

        state.value.triggerWords = await TriggerWordService.getAll()
      },
      successMessageTitle: 'Salvo com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.triggerWord],
    })
  }

  function removeAlternativeMessage(index: number) {
    state.value.form.alternativeMessages =
      state.value.form.alternativeMessages.filter((_, idx) => idx != index)
  }

  function addSuggestedMessage(text: string) {
    state.value.form.alternativeMessages.push(text)
  }

  function clearAlternativeMessageOptions() {
    state.value.options.alternativeMessages = []
  }

  function hasErrorMessage(hasError: boolean) {
    state.value.hasErrorMessage = hasError
  }

  return {
    state,
    dialog,
    loader,
    save,
    fetchList,
    toggleDialog,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    triggerWordSave,
    hasErrorMessage,
    clearEditDialog,
    openActionDialog,
    triggerWordDelete,
    openTriggerDialog,
    addSuggestedMessage,
    getAlternativeMessages,
    removeAlternativeMessage,
    clearAlternativeMessageOptions,
  }
}
