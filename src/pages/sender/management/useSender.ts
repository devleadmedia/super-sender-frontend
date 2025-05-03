import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import type { Status } from 'src/enums/Status.enum'
import type { ISender } from 'src/types/sender/ISender.type'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SenderService from 'src/services/sender/sender.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { useSheet } from 'src/composables/useSheet'

interface IState {
  form: {
    id?: string
    operator: string
    ddd: string
    number: string
    status: Status
  }
  formCreate: File | null
  list: ISender[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISender[]
}

export function useSender() {
  const initState: IState = {
    formCreate: null,
    list: [],
    form: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
  }

  const dialog = {
    edit: 'edit-dog34g12e',
    action: 'action-g34d129j',
    create: 'create-g34d129j',
  }

  const loader = {
    list: 'list-dog34g12e',
    edit: 'edit-dog34g12e',
    action: 'action-g34d129j',
    create: 'create-g34d129j',
  }

  const state = ref<IState>(cloneDeep(initState))

  const { loaderStatus } = useLoader()
  const { toggleDialog, closeDialog } = useDialog()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await SenderService.getAll()
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
          await SenderService.save(
            id,
            state.value.form.ddd,
            state.value.form.number,
            state.value.form.operator,
          )
        else if (state.value.formCreate)
          await SenderService.create(state.value.formCreate)
      },
      successCallback: async () => {
        await fetchList()
        closeDialog(dialog.edit)
        closeDialog(dialog.create)
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
          await SenderService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SenderService.disable(ids)
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

  function openEditDialog(item?: ISender) {
    if (item) {
      state.value.form = cloneDeep({ ...item })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function openCreateDialog() {
    toggleDialog(dialog.create)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
  }

  function clearCreateDialog() {
    state.value.formCreate = null
  }

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action

    toggleDialog(dialog.action)
  }

  async function downloadTemplate() {
    const { exportXLSX } = useSheet()

    await requester.dispatch({
      callback: async () => {
        await exportXLSX(
          [],
          [
            [
              'operadora',
              'ddd',
              'numero',
            ],
          ],
          `remetentes`,
          '',
          {},
        )
      },
      errorMessageTitle: 'Erro ao exportar',
      errorMessage: 'Não foi posssível exportar o template',
      loaders: [],
    })
  }

  return {
    state,
    loader,
    dialog,
    save,
    fetchList,
    loaderStatus,
    toggleDialog,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openCreateDialog,
    openActionDialog,
    downloadTemplate,
    clearCreateDialog,
  }
}
