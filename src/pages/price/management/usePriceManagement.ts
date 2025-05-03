import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import type { Status } from 'src/enums/Status.enum'
import type { IPrice } from 'src/types/price/IPrice.type'
import type {
  IDataEmail,
  IDataSMS,
  IDataWhatsapp,
  ITablePrice,
} from 'src/types/price/ITablePrice.type'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PriceService from 'src/services/price.service'
import * as UserService from 'src/services/user.service'
import { cloneDeep } from 'src/utils/clone.util'
import type { ShippingType } from 'src/enums/ShippingType.enum'
import type { IUser } from 'src/types/user/IUser.type'
import { dialog, initState, loader } from './priceManagement.const'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

export interface IState {
  visiblePassword: boolean
  alterPassword: boolean
  options: {
    clients: IUser[]
  }
  form: {
    id: string
    shippingTypeStep: ShippingType
    shippingType: ShippingType[]
    client: string
    status: Status
    tablePriceSMS: ITablePrice<IDataSMS>[]
    tablePriceEmail: ITablePrice<IDataEmail>[]
    tablePriceWhatsapp: ITablePrice<IDataWhatsapp>[]
  }
  list: IPrice[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: IPrice[]
}

export function usePriceManagement() {
  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await PriceService.getAll()
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
          await PriceService.save(
            id,
            state.value.form.shippingTypeStep,
            state.value.form.shippingType,
            state.value.form.client,
            state.value.form.status,
            state.value.form.tablePriceSMS,
            state.value.form.tablePriceEmail,
            state.value.form.tablePriceWhatsapp,
          )
        else
          await PriceService.create(
            state.value.form.shippingTypeStep,
            state.value.form.shippingType,
            state.value.form.client,
            state.value.form.status,
            state.value.form.tablePriceSMS,
            state.value.form.tablePriceEmail,
            state.value.form.tablePriceWhatsapp,
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
          await PriceService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await PriceService.disable(ids)
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

  function openEditDialog(item?: IPrice) {
    if (item) {
      const client = state.value.options.clients.find(
        (c) => c.id === item.client.id,
      )!
      const [firstShippingType] = client.shippingType

      state.value.form = cloneDeep({
        ...item,
        client: item.client.id,
        shippingType: client.shippingType,
        shippingTypeStep: firstShippingType!,
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

  function setShippingType(shippingType: ShippingType) {
    state.value.form.shippingTypeStep = shippingType
  }

  function updateClient(cliendId: string) {
    const client = state.value.options.clients.find((c) => c.id === cliendId)!
    const [firstShippingType] = client.shippingType

    state.value.form.shippingType = client.shippingType
    state.value.form.shippingTypeStep = firstShippingType!
  }

  function isActive(shippingType: ShippingType): boolean {
    return (
      !!state.value.form.shippingType.length &&
      state.value.form.shippingTypeStep === shippingType
    )
  }

  return {
    state,
    dialog,
    loader,
    save,
    isActive,
    fetchList,
    updateClient,
    toggleDialog,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    setShippingType,
    clearEditDialog,
    openActionDialog,
  }
}
