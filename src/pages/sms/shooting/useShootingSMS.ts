import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ContactSMSService from 'src/services/sms/contactSMS.service'
import * as campaignservice from 'src/services/campaign/campaign.service'
import * as ShootingSMSService from 'src/services/sms/shootingSMS.service'
import * as UserService from 'src/services/user.service'
import { cloneDeep } from 'src/utils/clone.util'
import type { IContactSMS } from 'src/types/sms/IContactSMS.type'
import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import { ShootingStatusSMS } from 'src/enums/shot/ShootingStatusSMS.type'
import type { IShootingSMS } from 'src/types/sms/IShootingSMS.type'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { IUser } from 'src/types/user/IUser.type'
import { useRoles } from 'src/composables/useRoles'
import { IRequestTable } from 'src/types/quasar/IRequestTable.type'
import { IOption } from 'src/types/IOption.type'
import { ICampaign } from 'src/types/campaign/ICampaign.type'

export interface IState {
  step: string
  resultSendRequest: number | null
  options: {
    campaigns: ICampaign[]
    contactSMS: IContactSMS[]
    users: IUser[]
    typeSMS: IOption<string>[]
  }
  optionsData: {
    campaigns: ICampaign[]
    contactSMS: IContactSMS[]
    users: IUser[]
    typeSMS: IOption<string>[]
  }
  form: {
    id?: string
    date: string
    name: string
    typeShot: TypeShotSMS
    typeSMS: TypeSMS
    typeRoute: TypeRouteSMS
    status: ShootingStatusSMS
    campaignId: string
    contactIds: string[]
  }
  list: IShootingSMS[]
  filter: {
    search: string
    rangeDate: { to: string; from: string }
    typeShot?: TypeShotSMS
    typeSMS?: TypeSMS
    typeRoute?: TypeRouteSMS
    status?: ShootingStatusSMS
    user?: string
  }
  actionType: ActionDialogOptions
  actionsData: IShootingSMS[]
  shooting: string
  shippingDialog: {
    shooting: IShootingSMS | null
  }
  pagination: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
  }
}

export function useShootingSMS() {
  const step = {
    config: 'config-d1212d1',
    cost: 'cost-d1212d1',
  }

  const initState: IState = {
    step: step.config,
    resultSendRequest: null,
    form: {
      id: '',
      contactIds: [],
      date: '',
      name: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    options: {
      contactSMS: [],
      campaigns: [],
      users: [],
      typeSMS: [],
    },
    optionsData: {
      contactSMS: [],
      campaigns: [],
      users: [],
      typeSMS: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: {
      rangeDate: { from: '', to: '' },
      search: '',
    },
    list: [],
    shooting: '',
    shippingDialog: {
      shooting: null,
    },
    pagination: {
      sortBy: '',
      descending: false,
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0,
    },
  }

  const dialog = {
    edit: 'edit-1e12f342f',
    action: 'action-f3223f',
    shipping: 'shipping-f3223f',
  }

  const loader = {
    list: 'list-1e12f342f',
    edit: 'edit-1e12f342f',
    action: 'action-f3223f',
    shipping: 'shipping-f3223f',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()
  const { isAdmin } = useRoles()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        const Campaing = await campaignservice.getAll()
        const contactSMS = await ContactSMSService.getAll()
        const users = await UserService.getAll()

        state.value.options.campaigns = cloneDeep(Campaing)
        state.value.optionsData.campaigns = cloneDeep(Campaing)
        state.value.options.contactSMS = cloneDeep(contactSMS)
        state.value.optionsData.contactSMS = cloneDeep(contactSMS)
        state.value.options.users = cloneDeep(users)
        state.value.optionsData.users = cloneDeep(users)
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os usuários',
      loaders: [loader.list],
    })
  }

  async function sendRequest() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        if (id)
          state.value.resultSendRequest = await ShootingSMSService.save(
            id,
            state.value.form.date,
            state.value.form.name,
            state.value.form.typeShot,
            state.value.form.typeSMS,
            state.value.form.typeRoute,
            state.value.form.status,
            state.value.form.campaignId,
            state.value.form.contactIds,
          )
        else
          state.value.resultSendRequest = await ShootingSMSService.create(
            state.value.form.date,
            state.value.form.name,
            state.value.form.typeShot,
            state.value.form.typeSMS,
            state.value.form.typeRoute,
            state.value.form.status,
            state.value.form.campaignId,
            state.value.form.contactIds,
          )
      },
      successCallback: () => {
        state.value.step = step.cost
      },
      successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `Não foi possível ${
        state.value.form.id ? 'editar' : 'cadastrar'
      }`,
      loaders: [loader.edit],
    })
  }

  async function confirmShooting() {
    await requester.dispatch({
      callback: async () => {
        await ShootingSMSService.confirmShooting()
      },
      successCallback: async () => {
        await fetchList()
        toggleDialog(dialog.edit)
      },
      successMessageTitle: 'Disparo agendado com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível agendar disparo',
      loaders: [loader.edit],
    })
  }

  async function confirmAction() {
    await requester.dispatch({
      callback: async () => {
        const { actionType } = state.value

        const ids = state.value.actionsData.map((item) => item.id)

        switch (actionType) {
          case ActionDialogOptions.delete:
            await ShootingSMSService.deleteItem(ids)
            break
          case ActionDialogOptions.pause:
            await ShootingSMSService.pause(ids)
            break
          case ActionDialogOptions.cancel:
            await ShootingSMSService.cancel(ids)
            break
          case ActionDialogOptions.play:
            await ShootingSMSService.play(ids)
            break
          default:
            break
        }
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

  function openShippingDialog(shooting: IShootingSMS) {
    toggleDialog(dialog.shipping)
    state.value.shippingDialog.shooting = shooting
  }

  function openEditDialog(item?: IShootingSMS) {
    if (item) {
      state.value.form = cloneDeep({
        ...item,
        campaignId: item.campaign.id,
      })
    } else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
    state.value.step = step.config
  }

  function openActionDialog(
    actionType: ActionDialogOptions,
    item: IShootingSMS,
  ) {
    state.value.actionType = actionType
    state.value.actionsData = [item]

    toggleDialog(dialog.action)
  }

  function canPausedOrPlayerShot(isPaused: boolean, status: ShootingStatusSMS) {
    if (isPaused) return !(status == ShootingStatusSMS.paused)
    return !(status == ShootingStatusSMS.processing)
  }

  function canCancelShot(status: ShootingStatusSMS) {
    return ![ShootingStatusSMS.paused, ShootingStatusSMS.scheduled].includes(
      status,
    )
  }

  function canDeleteShot(status: ShootingStatusSMS) {
    return ![
      ShootingStatusSMS.error,
      ShootingStatusSMS.executed,
      ShootingStatusSMS.canceled,
    ].includes(status)
  }

  async function onRequestTable(props: IRequestTable) {
    await requester.dispatch({
      callback: async () => {
        const { page, rowsPerPage, sortBy, descending } = props.pagination

        const response = await ShootingSMSService.getAll(
          page,
          rowsPerPage,
          sortBy,
          descending,
          state.value.filter.search,
          state.value.filter.rangeDate.from,
          state.value.filter.rangeDate.to,
          state.value.filter.typeShot,
          state.value.filter.typeSMS,
          state.value.filter.typeRoute,
          state.value.filter.status,
          state.value.filter.user,
        )

        state.value.list = response.data

        state.value.pagination = {
          ...props.pagination,
          rowsNumber: response.totalRows,
        }
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os usuários',
      loaders: [loader.list],
    })
  }

  return {
    step,
    state,
    dialog,
    loader,
    isAdmin,
    fetchList,
    sendRequest,
    toggleDialog,
    createDialog,
    loaderStatus,
    canCancelShot,
    canDeleteShot,
    confirmAction,
    onRequestTable,
    openEditDialog,
    confirmShooting,
    clearEditDialog,
    openActionDialog,
    openShippingDialog,
    canPausedOrPlayerShot,
  }
}
