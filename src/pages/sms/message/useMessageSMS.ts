import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { computed, ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as MessageSMSService from 'src/services/sms/messageSMS.service'
import * as UserService from 'src/services/user.service'
import { cloneDeep } from 'src/utils/clone.util'
import type { IUser } from 'src/types/user/IUser.type'
import type { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { shadowBanWords } from 'src/constants/sms/shadowBanWords.const'

export interface IState {
  triggerSearch: string
  options: {
    clients: IUser[]
  }
  form: {
    id: string
    title: string
    message: string
    status: Status
  }
  list: IMessageSMS[]
  filter: string
  actionType: 'delete' | 'disable'
  actionsData: IMessageSMS[]
}

export function useMessageSMS() {
  const initState: IState = {
    triggerSearch: '',
    form: {
      id: '',
      title: '',
      status: Status.active,
      message: '',
    },
    options: {
      clients: [],
    },
    actionsData: [],
    actionType: 'delete',
    filter: '',
    list: [],
  }

  const dialog = {
    edit: 'edit-84g34g3',
    triggerWord: 'triggerWord-84g34g3',
    action: 'action-h5h7jf23f',
  }

  const loader = {
    list: 'list-84g34g3',
    edit: 'edit-84g34g3',
    action: 'action-h5h7jf23f',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await MessageSMSService.getAll()
        state.value.options.clients = await UserService.getAll()
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

        if (actionType == 'delete') await MessageSMSService.deleteItem(ids)
        if (actionType == 'disable') await MessageSMSService.disable(ids)
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

  function openEditDialog(item?: IMessageSMS) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function openTriggerDialog() {
    state.value.triggerSearch = ''
    toggleDialog(dialog.triggerWord)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
  }

  function openActionDialog(action: 'delete' | 'disable') {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  const triggerWordList = computed(() => {
    const { triggerSearch } = state.value

    if (!triggerSearch) return shadowBanWords

    const lowerSearch = triggerSearch.toLowerCase()

    return shadowBanWords
      .map((shadow) => {
        const filteredData = shadow.data.filter((item) =>
          item.toLowerCase().includes(lowerSearch),
        )

        const categoryMatches = shadow.category
          .toLowerCase()
          .includes(lowerSearch)

        if (categoryMatches || filteredData.length > 0) {
          return {
            ...shadow,
            data: categoryMatches ? shadow.data : filteredData,
          }
        }

        return null
      })
      .filter(Boolean)
  })

  return {
    state,
    dialog,
    loader,
    triggerWordList,
    save,
    fetchList,
    toggleDialog,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
    openTriggerDialog,
  }
}
