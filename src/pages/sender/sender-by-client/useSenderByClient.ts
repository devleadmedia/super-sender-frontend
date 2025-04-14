import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import type { Status } from 'src/enums/Status.enum'
import type { ISenderByClient } from 'src/types/sender/ISenderByClient.type'
import type { IUser } from 'src/types/user/IUser.type'
import type { ISender } from 'src/types/sender/ISender.type'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SenderByClientService from 'src/services/sender/sender-for-client.service'
import * as UserService from 'src/services/user.service'
import * as SenderService from 'src/services/sender/sender.service'

interface IState {
  form: {
    id?: string
    client: string
    senders: ISender[]
    status: Status
  }
  list: ISenderByClient[]
  filter: string
  actionType: 'delete' | 'disable'
  actionsData: ISenderByClient[]
  options: {
    clients: IUser[]
    senders: ISender[]
  }
}

export function useSenderByClient() {
  const initState: IState = {
    list: [],
    form: {
      senders: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    options: {
      clients: [],
      senders: [],
    },
    actionsData: [],
    actionType: 'delete',
    filter: '',
  }

  const dialog = {
    edit: 'edit-f5h56j563',
    action: 'action-dasdd24h5',
  }

  const loader = {
    list: 'list-f5h56j563',
    edit: 'edit-f5h56j563',
    action: 'action-dasdd24h5',
  }

  const state = ref<IState>(cloneDeep(initState))

  const { loaderStatus } = useLoader()
  const { toggleDialog } = useDialog()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.options.clients = await UserService.getAll()
        state.value.options.senders = await SenderService.getAll()
        state.value.list = await SenderByClientService.getAll()
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
          await SenderByClientService.save(
            id,
            state.value.form.status,
            state.value.form.client,
            state.value.form.senders.map((s) => s.id),
          )
        else
          await SenderByClientService.create(
            state.value.form.client,
            state.value.form.senders.map((s) => s.id),
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

        if (actionType == 'delete') await SenderByClientService.deleteItem(ids)
        if (actionType == 'disable') await SenderByClientService.disable(ids)
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

  function openEditDialog(item?: ISenderByClient) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
        client: item.client.id,
        senders: state.value.options.senders.filter((s) =>
          item.senderIds.includes(s.id),
        ),
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep({ ...initState.form })
  }

  function openActionDialog(action: 'delete' | 'disable') {
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
    confirmAction,
    openActionDialog,
    openEditDialog,
    clearEditDialog,
  }
}
