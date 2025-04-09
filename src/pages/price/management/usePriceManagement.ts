import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import type { Status } from 'src/enums/Status.enum'
import type { IPrice } from 'src/types/price/IPrice.type'
import type { IDataSMS, ITablePrice } from 'src/types/price/ITablePrice.type'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PriceService from 'src/services/price.service'
import * as UserService from 'src/services/user.service'
import { cloneDeep } from 'src/utils/clone.util'
import { TypeRoute, TypeShot, TypeSMS } from 'src/enums/shot/sms/TypesSMS.enum'

interface IState {
  visiblePassword: boolean
  alterPassword: boolean
  options: {
    clients: IBasicEntity<string>[]
  }
  form: {
    id: string
    name: string
    client: string
    status: Status
    tablePrice: ITablePrice<IDataSMS>[]
  }
  list: IPrice[]
  filter: string
  actionType: 'delete' | 'disable'
  actionsData: IPrice[]
}

export function usePriceManagement() {
  const initState: IState = {
    form: {
      tablePrice: [
        {
          name: 'Novo',
          data: [
            {
              typeRoute: TypeRoute.shortCode,
              typeShot: TypeShot.oneWay,
              typeSMS: TypeSMS.flash,
              value: 0,
            },
          ],
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    options: {
      clients: [],
    },
    visiblePassword: false,
    alterPassword: false,
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

  function addTablePrice() {
    const [example] = initState.form.tablePrice
    state.value.form.tablePrice.push(cloneDeep(example!))
  }

  function removeTablePrice(tableIdx: number) {
    if (!state.value.form.tablePrice[tableIdx]) return
    else
      state.value.form.tablePrice = state.value.form.tablePrice.filter(
        (_, idx) => idx != tableIdx,
      )
  }

  function addTablePriceItem(tableIdx: number) {
    if (!state.value.form.tablePrice[tableIdx]) return
    else
      state.value.form.tablePrice[tableIdx].data.push({
        typeRoute: TypeRoute.shortCode,
        typeShot: TypeShot.oneWay,
        typeSMS: TypeSMS.flash,
        value: 0,
      })
  }

  function removeTablePriceItem(tableIdx: number, index: number) {
    if (!state.value.form.tablePrice[tableIdx]) return
    else
      state.value.form.tablePrice[tableIdx].data = state.value.form.tablePrice[
        tableIdx
      ].data.filter((_, idx) => idx != index)
  }

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
        if (id) await PriceService.save(id)
        else await PriceService.create()
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

        if (actionType == 'delete') await PriceService.deleteItem(ids)
        if (actionType == 'disable') await PriceService.disable(ids)
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
    if (item) state.value.form = cloneDeep({ ...item, client: item.client.id })
    else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
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
    createDialog,
    loaderStatus,
    confirmAction,
    addTablePrice,
    openEditDialog,
    clearEditDialog,
    removeTablePrice,
    openActionDialog,
    addTablePriceItem,
    removeTablePriceItem,
  }
}
