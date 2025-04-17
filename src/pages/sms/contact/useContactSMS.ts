import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ContactSMSService from 'src/services/sms/contactSMS.service'
import * as UserService from 'src/services/user.service'
import { cloneDeep } from 'src/utils/clone.util'
import type { IUser } from 'src/types/user/IUser.type'
import type { IContactSMS } from 'src/types/sms/IContactSMS.type'

export interface IState {
  options: {
    clients: IUser[]
  }
  form: {
    id?: string
    title: string
    clientId: string
    status: Status
    file: File | null
  }
  list: IContactSMS[]
  filter: string
  actionType: 'delete' | 'disable'
  actionsData: IContactSMS[]
}

export function useContactSMS() {
  const initState: IState = {
    form: {
      id: '',
      title: '',
      clientId: '',
      status: Status.active,
      file: null,
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
    edit: 'edit-1e12f342f',
    action: 'action-f3223f',
  }

  const loader = {
    list: 'list-1e12f342f',
    edit: 'edit-1e12f342f',
    action: 'action-f3223f',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await ContactSMSService.getAll()
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
          await ContactSMSService.save(
            id,
            state.value.form.title,
            state.value.form.status,
          )
        else await ContactSMSService.create(state.value.form.title)
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

        if (actionType == 'delete') await ContactSMSService.deleteItem(ids)
        if (actionType == 'disable') await ContactSMSService.disable(ids)
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

  function openEditDialog(item?: IContactSMS) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
        clientId: item.client.id,
        file: null,
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
  }

  function openActionDialog(action: 'delete' | 'disable') {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  function addContactFile(files: readonly File[]) {
    const [file] = files
    state.value.form.file = file || null
  }

  function removeContactFile() {
    state.value.form.file = null
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
    addContactFile,
    clearEditDialog,
    openActionDialog,
    removeContactFile,
  }
}
