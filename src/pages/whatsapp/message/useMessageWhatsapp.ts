import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as MessageWhatsappService from 'src/services/whatsapp/message/messageWhatsapp.service'
import * as UserService from 'src/services/user.service'
import * as CampaignService from 'src/services/campaign/campaign.service'
import { cloneDeep } from 'src/utils/clone.util'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { CurrentTypeFile, initState, IState } from './messageWhatsapp.const'
import { ITemplateMessageWhatsapp } from 'src/types/whatsapp/IMessageWhatsapp.type'
import { QInfiniteScroll } from 'quasar'
import {
  fileAudioWhatsapp,
  fileImageWhatsapp,
  fileVideoWhatsapp,
} from 'src/constants/whatsapp/permissionsFile.const'

export function useMessageSMS() {
  const dialog = {
    edit: 'edit-84g34g3',
    action: 'action-h5h7jf23f',
    openImage: 'openImage-fedjnfsdfdjnansdaj',
  }

  const loader = {
    list: 'list-84g34g3',
    edit: 'edit-84g34g3',
    action: 'action-h5h7jf23f',
  }

  const infiniteScroll = ref<QInfiniteScroll | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        if (state.value.options.clients.length == 0) {
          state.value.options.clients = await UserService.getAll()
          state.value.options.campaigns = await CampaignService.getAll()
        }

        state.value.list = await MessageWhatsappService.getAll()
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
          await MessageWhatsappService.save(
            id,
            state.value.form.title,
            state.value.form.status,
            state.value.form.campaignId,
          )
        else
          await MessageWhatsappService.create(
            state.value.form.title,
            state.value.form.campaignId,
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
          await MessageWhatsappService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await MessageWhatsappService.disable(ids)
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

  function openEditDialog(item?: ITemplateMessageWhatsapp) {
    if (item) {
      const initForm = cloneDeep(initState.form)

      state.value.form = cloneDeep({
        ...initForm,
        ...item,
        messagens: item.messagens.map((msg) => ({
          ...msg,
          file: null,
        })),
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
    state.value.form.urls.forEach((url) => URL.revokeObjectURL(url))
    removeCurrentFile()
  }

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  function addMessage() {
    const { file, fileURL, typeFile } = state.value.form

    state.value.form.messagens.push({
      id: crypto.randomUUID(),
      file: file,
      audioURL: typeFile === CurrentTypeFile.audio ? fileURL : null,
      fileURL: typeFile === CurrentTypeFile.file ? fileURL : null,
      imageURL: typeFile === CurrentTypeFile.image ? fileURL : null,
      videoURL: typeFile === CurrentTypeFile.video ? fileURL : null,
      message: state.value.form.currentMessage,
    })

    state.value.form.currentMessage = ''
    removeCurrentFile()
    setTimeout(scrollToBottom, 100)
  }

  function removeMessage(id: string) {
    state.value.form.messagens = state.value.form.messagens.filter(
      (item) => item.id !== id,
    )
  }

  function scrollToBottom() {
    const infiniteScrollHTML = infiniteScroll.value?.$el as HTMLDivElement

    infiniteScrollHTML.scroll({
      behavior: 'smooth',
      top: infiniteScrollHTML.scrollHeight,
    })
  }

  function openFile() {
    fileInput.value?.click()
  }

  async function handleFileChange(event: Event) {
    let error = 'Algum erro inesperado ocorreu'
    await requester.dispatch({
      callback: () => {
        const target = event.target as HTMLInputElement
        if (!target.files) throw Error('File undefined')
        const [file] = target.files
        if (!file) throw Error('File undefined')
        target.value = ''
        const fileSizeMB = file.size / (1024 * 1024)

        if (fileImageWhatsapp.includes(file.type)) {
          const maxSizeMB = 5

          if (fileSizeMB > maxSizeMB) {
            error = `A imagem excede o tamanho máximo de ${maxSizeMB}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.image
          state.value.form.urls.push(state.value.form.fileURL)
        }

        if (fileVideoWhatsapp.includes(file.type)) {
          const maxSizeMB = 16

          if (fileSizeMB > maxSizeMB) {
            error = `O vídeo excede o tamanho máximo de ${maxSizeMB}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.video
          state.value.form.urls.push(state.value.form.fileURL)
        }

        if (fileAudioWhatsapp.includes(file.type)) {
          const maxSizeMB = 16

          if (fileSizeMB > maxSizeMB) {
            error = `O audio excede o tamanho máximo de ${maxSizeMB}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.audio
          state.value.form.urls.push(state.value.form.fileURL)
          state.value.form.currentMessage = ''
        }
      },
      errorMessageTitle: 'Erro ao carregar',
      errorMessage: error,
    })
  }

  function removeCurrentFile() {
    state.value.form.file = null
    state.value.form.fileURL = null
  }

  function openImage(imageURL: string) {
    state.value.openImageURL = imageURL
    toggleDialog(dialog.openImage)
  }

  function disableChatMessage(): boolean {
    const { fileURL, typeFile } = state.value.form
    return !!fileURL && typeFile == CurrentTypeFile.audio
  }

  function disableSendInput() {
    const { currentMessage, file } = state.value.form
    return file == null && currentMessage.trim() === ''
  }

  return {
    state,
    dialog,
    loader,
    fileInput,
    infiniteScroll,
    save,
    openFile,
    fetchList,
    openImage,
    addMessage,
    toggleDialog,
    createDialog,
    loaderStatus,
    removeMessage,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    disableSendInput,
    handleFileChange,
    openActionDialog,
    removeCurrentFile,
    disableChatMessage,
  }
}
