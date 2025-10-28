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
import {
  IMessageWhatsapp,
  ITemplateMessageWhatsapp,
} from 'src/types/whatsapp/IMessageWhatsapp.type'
import { QInfiniteScroll } from 'quasar'
import {
  fileAudioWhatsapp,
  fileDocumentWhatsapp,
  fileDocumentWhatsappDictiory,
  fileImageWhatsapp,
  fileMaxSizeWhatsapp,
  fileVideoWhatsapp,
} from 'src/constants/whatsapp/permissionsFile.const'
import { formatFileSize } from 'src/utils/file.util'

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
            state.value.form.messagens,
          )
        else
          await MessageWhatsappService.create(
            state.value.form.title,
            state.value.form.campaignId,
            state.value.form.messagens,
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

  function editMessage() {
    const index = state.value.form.messagens.findIndex(
      (item) => item.id === state.value.form.messageEdit?.id,
    )
    if (index !== -1)
      state.value.form.messagens[index]!.message =
        state.value.form.currentMessage

    state.value.form.currentMessage = ''
    state.value.form.messageEdit = null
  }

  function cancelEditMessage() {
    state.value.form.currentMessage = ''
    state.value.form.messageEdit = null
  }

  function addMessage() {
    if (state.value.form.messageEdit) return editMessage()

    const { file, fileURL, typeFile } = state.value.form

    state.value.form.messagens.push({
      id: crypto.randomUUID(),
      file: file,
      audioURL: typeFile === CurrentTypeFile.audio ? fileURL : null,
      document:
        typeFile === CurrentTypeFile.document && file
          ? {
              name: file.name,
              size: formatFileSize(file?.size),
              type: fileDocumentWhatsappDictiory[file.type] || file.type,
              url: fileURL || '',
            }
          : null,
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

    state.value.form.currentMessage = ''
    state.value.form.messageEdit = null
  }

  function selectEditMessage(item: IMessageWhatsapp) {
    state.value.form.currentMessage = item.message
    state.value.form.messageEdit = item
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
          if (fileSizeMB > fileMaxSizeWhatsapp.image) {
            error = `A imagem excede o tamanho máximo de ${fileMaxSizeWhatsapp.image}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.image
          state.value.form.urls.push(state.value.form.fileURL)
        }

        if (fileVideoWhatsapp.includes(file.type)) {
          if (fileSizeMB > fileMaxSizeWhatsapp.video) {
            error = `O vídeo excede o tamanho máximo de ${fileMaxSizeWhatsapp.video}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.video
          state.value.form.urls.push(state.value.form.fileURL)
        }

        if (fileAudioWhatsapp.includes(file.type)) {
          if (fileSizeMB > fileMaxSizeWhatsapp.audio) {
            error = `O audio excede o tamanho máximo de ${fileMaxSizeWhatsapp.audio}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.audio
          state.value.form.urls.push(state.value.form.fileURL)
          state.value.form.currentMessage = ''
        }

        if (fileDocumentWhatsapp.includes(file.type)) {
          if (fileSizeMB > fileMaxSizeWhatsapp.document) {
            error = `O documento excede o tamanho máximo de ${fileMaxSizeWhatsapp.document}MB`
            throw new Error('O arquivo ultrapassou o limite permitido')
          }

          state.value.form.file = file
          state.value.form.fileURL = URL.createObjectURL(file)
          state.value.form.typeFile = CurrentTypeFile.document
          state.value.form.urls.push(state.value.form.fileURL)
          state.value.form.fileDocument = {
            name: file.name,
            size: formatFileSize(file.size),
            type: fileDocumentWhatsappDictiory[file.type] || file.type,
            url: state.value.form.fileURL,
          }
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
    return (
      !!fileURL &&
      typeFile == CurrentTypeFile.audio ||
      typeFile == CurrentTypeFile.document
    )
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
    selectEditMessage,
    cancelEditMessage,
    removeCurrentFile,
    disableChatMessage,
  }
}
