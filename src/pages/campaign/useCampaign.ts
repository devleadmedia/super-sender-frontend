import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { cloneDeep } from 'src/utils/clone.util'
import * as CampaignService from 'src/services/campaign/campaign.service'
import * as UserService from 'src/services/user.service'
import * as MessageService from 'src/services/sms/messageSMS.service'
import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ICampaign } from 'src/types/campaign/ICampaign.type'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import { Status } from 'src/enums/Status.enum'
import { IMessageSMS } from 'src/types/sms/IMessageSMS.type'
import { IUser } from 'src/types/user/IUser.type'

export interface IState {
  options: {
    messages: IMessageSMS[]
    clients: IUser[]
  }
  optionsData: {
    messages: IMessageSMS[]
    clients: IUser[]
  }
  form: {
    id?: string
    name: string
    status: Status
    menssageIds: string[]
  }
  list: ICampaign[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ICampaign[]
}

const initState: IState = {
  options: {
    messages: [],
    clients: [],
  },
  optionsData: {
    messages: [],
    clients: [],
  },
  form: {
    name: '',
    status: Status.active,
    menssageIds: [],
  },
  list: [],
  filter: '',
  actionType: ActionDialogOptions.delete,
  actionsData: [],
}

const dialog = {
  edit: 'edit-2g4g3g',
  action: 'action-j56j56g345',
}

const loader = {
  list: 'list-f325h4h45',
  edit: 'edit-3d2f3g4',
  action: 'action-j76f23d',
}

export function useCampaign() {
  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        const clients = await UserService.getAll()
        const messages = await MessageService.getAll()

        state.value.optionsData.clients = cloneDeep(clients)
        state.value.options.clients = cloneDeep(clients)
        state.value.optionsData.messages = cloneDeep(messages)
        state.value.options.messages = cloneDeep(messages)

        state.value.list = await CampaignService.getAll()
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
          await CampaignService.save(
            id,
            state.value.form.name,
            state.value.form.status,
            state.value.form.menssageIds,
          )
        else
          await CampaignService.create(
            state.value.form.name,
            state.value.form.status,
            state.value.form.menssageIds,
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
          await CampaignService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await CampaignService.disable(ids)
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

  function openEditDialog(item?: ICampaign) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
  }

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  return {
    state,
    dialog,
    loader,
    save,
    fetchList,
    loaderStatus,
    toggleDialog,
    createDialog,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
  }
}
