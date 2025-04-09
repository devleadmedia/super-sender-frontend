import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import type { Roles } from 'src/enums/Roles.enum'
import type { ShootingPermissions } from 'src/enums/shot/sms/ShootingPermissions.enum'
import type { Status } from 'src/enums/Status.enum'
import type { IUser } from 'src/types/user/IUser.type'
import type { ShippingType } from 'src/enums/ShippingType.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { computed, ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as UserService from 'src/services/user.service'
import { shootingPermissionsOptions } from 'src/constants/shot/shootingPermissions.const'

interface IState {
  visiblePassword: boolean
  alterPassword: boolean
  form: {
    id?: string
    name: string
    email: string
    status: Status
    roles: Roles[]
    shippingType: ShippingType[]
    shootingPermissions: ShootingPermissions[]
    password: string
    confirmPassword: string
  }
  list: IUser[]
  filter: string
  actionType: 'delete' | 'disable'
  actionsData: IUser[]
}

export function useUser() {
  const initState: IState = {
    form: {
      shippingType: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
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
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await UserService.getAll()
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
          await UserService.save(
            id,
            state.value.form.email,
            state.value.form.name,
            state.value.form.password,
            state.value.form.status,
            state.value.form.roles,
            state.value.form.shootingPermissions,
          )
        else
          await UserService.create(
            state.value.form.email,
            state.value.form.name,
            state.value.form.roles,
            state.value.form.shootingPermissions,
            state.value.form.password,
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

        if (actionType == 'delete') await UserService.deleteItem(ids)
        if (actionType == 'disable') await UserService.disable(ids)
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

  function openEditDialog(item?: IUser) {
    if (item)
      state.value.form = {
        ...item,
        confirmPassword: '',
        password: '',
      }
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

  function clearShootingPermissions(value: ShippingType[]) {
    const shooting = shootingPermissionsOptions.filter((sp) =>
      state.value.form.shootingPermissions.includes(sp.value),
    )

    state.value.form.shootingPermissions = shooting
      .filter((sp) => value.includes(sp.type))
      .map((sp) => sp.value)
  }

  const currentShootingPermissionsOptions = computed(() => {
    return shootingPermissionsOptions.filter((sp) =>
      state.value.form.shippingType.includes(sp.type),
    )
  })

  return {
    state,
    dialog,
    loader,
    currentShootingPermissionsOptions,
    save,
    fetchList,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
    clearShootingPermissions,
  }
}
