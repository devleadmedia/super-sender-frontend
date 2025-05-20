import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SupportService from 'src/services/support/support.service'
import * as UserService from 'src/services/user.service'
import { cloneDeep } from 'src/utils/clone.util'
import type { IUser } from 'src/types/user/IUser.type'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { IMessageSupport, ISupport } from 'src/types/support/ISupport.type'
import { IBasicEntity } from 'src/types/IBasicEntity.type'
import { SupportStatus } from 'src/enums/support/SupportStatus.enum'
import { QScrollArea } from 'quasar'
import { LIMIT_MB, MAX_LIMIT_MB } from './support.const'
import { useNotify } from 'src/composables/useNotify'

export interface IState {
  options: {
    clients: IUser[]
  }
  openRequestForm: {
    title: string
    description: string
    files: File[] | null
  }
  form: {
    id: string
    title: string
    description: string
    status: SupportStatus
    requester: IBasicEntity<string>
    messages: IMessageSupport[]
    date: string
    currentMessage: string
    files: File[]
    previews: string[]
  }
  list: ISupport[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISupport[]
}

const scrollArea = ref<QScrollArea | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

export function useSupport() {
  const initState: IState = {
    openRequestForm: {
      title: '',
      description: '',
      files: [],
    },
    form: {
      id: '',
      requester: {
        id: '',
        name: '',
      },
      previews: [],
      title: '',
      description: '',
      status: SupportStatus.cancel,
      messages: [],
      currentMessage: '',
      date: '',
      files: [],
    },
    options: {
      clients: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
  }

  const dialog = {
    edit: 'edit-1e12f342f',
    openRequest: 'openRequest-1f34g34g9k',
    action: 'action-f3223f',
  }

  const loader = {
    list: 'list-1e12f342f',
    openRequest: 'openRequest-1f34g34g9k',
    edit: 'edit-1e12f342f',
    action: 'action-f3223f',
    downloadContact: 'downloadContact-f3223f',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await SupportService.getAll()
        state.value.options.clients = await UserService.getAll()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os usuários',
      loaders: [loader.list],
    })
  }

  async function create() {
    await requester.dispatch({
      callback: async () => {
        await SupportService.create(
          state.value.form.title,
          state.value.form.description,
          state.value.form.files,
        )
      },
      successCallback: async () => {
        await fetchList()
        toggleDialog(dialog.openRequest)
      },
      successMessageTitle: `Solicitação aberta com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `Não foi possível realizar a ação`,
      loaders: [loader.openRequest],
    })
  }

  async function sendMessage() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        const response = await SupportService.sendMessage(
          id,
          state.value.form.currentMessage,
          state.value.form.files,
        )

        state.value.form.messages.push(response)
      },
      successCallback: () => {
        scrollToBottom()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível enviar a mensagem',
      loaders: [loader.edit],
    })
  }

  async function updateStatus() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        await SupportService.updateStatus(id, state.value.form.status)
      },
      successCallback: async () => {
        toggleDialog(dialog.edit)
        await fetchList()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível atualizar o  chamado',
      loaders: [loader.edit],
    })
  }

  async function confirmAction() {
    await requester.dispatch({
      callback: async () => {
        const { actionType } = state.value

        const ids = state.value.actionsData.map((item) => item.id)

        if (actionType == ActionDialogOptions.delete)
          await SupportService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SupportService.disable(ids)
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

  function openEditDialog(item?: ISupport) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
        currentMessage: '',
        files: [],
        previews: [],
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function openRequestDialog() {
    state.value.openRequestForm = cloneDeep(initState.openRequestForm)
    toggleDialog(dialog.openRequest)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
  }

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  function addRequestFormFile(files: readonly File[]) {
    state.value.openRequestForm.files = files as File[]
  }

  function removeRequestFormFile() {
    state.value.form.files = []
  }

  function scrollToBottom() {
    scrollArea.value?.setScrollPercentage('vertical', 100, 0)
  }

  function triggerFileInput() {
    fileInput.value?.click()
  }

  function handleFileChange(event: Event) {
    const { feedback } = useNotify()

    const target = event.target as HTMLInputElement
    const files = target.files

    try {
      if (!files?.length) return

      for (let idx = 0; idx < files.length; idx++) {
        const reader = new FileReader()
        const file = files.item(idx)

        if (!file) return

        if (file.size > LIMIT_MB * 1024 * 1024)
          return feedback({
            position: 'bottom-right',
            title: `O arquivo não pode possuir mais que ${LIMIT_MB}MB`,
            description: 'Adicione um arquivo menor',
            type: 'negative',
            progress: true,
          })

        reader.onload = (ev) => {
          state.value.form.previews.push(ev.target?.result as string)
        }

        reader.readAsDataURL(file)
        state.value.form.files.push(file)
      }
    } catch (e) {
      console.error(e)
      feedback({
        position: 'bottom-right',
        title: 'Erro ao carregar arquivo',
        description: 'Houve um erro ao carregar imagem',
        type: 'negative',
        progress: true,
      })
    } finally {
      fileInput.value!.value = ''
    }
  }

  function removeItemPreview(index: number) {
    state.value.form.files = state.value.form.files.filter(
      (_, idx) => idx != index,
    )
    state.value.form.previews = state.value.form.previews.filter(
      (_, idx) => idx != index,
    )
  }

  function hasExceededMaxImageSizeLimit() {
    const total = state.value.form.files.reduce((a, b) => {
      return a + b.size
    }, 0)

    console.log(total)

    return total > MAX_LIMIT_MB * 1024 * 1024
  }

  return {
    state,
    dialog,
    loader,
    fileInput,
    scrollArea,
    create,
    fetchList,
    sendMessage,
    toggleDialog,
    createDialog,
    loaderStatus,
    updateStatus,
    confirmAction,
    scrollToBottom,
    openEditDialog,
    clearEditDialog,
    handleFileChange,
    triggerFileInput,
    openActionDialog,
    openRequestDialog,
    removeItemPreview,
    addRequestFormFile,
    removeRequestFormFile,
    hasExceededMaxImageSizeLimit,
  }
}
