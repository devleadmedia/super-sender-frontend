import { useLoader } from 'src/composables/useLoader'
import requester from 'src/helpers/requester/Requester.helper'
import type { IStatement } from 'src/types/statement/IStatement.type'
import type { IUser } from 'src/types/user/IUser.type'
import { computed, ref } from 'vue'
import * as StatementService from 'src/services/statement.service'
import * as UserService from 'src/services/user.service'
import type { ShippingType } from 'src/enums/ShippingType.enum'
import { useRoles } from 'src/composables/useRoles'

interface IState {
  isGrid: boolean
  list: IStatement[]
  client?: number
  options: {
    clients: IUser[]
  }
  filter: {
    search: string
    rangeDate: {
      to: string
      from: string
    }
    recharge: boolean
    shippingType?: ShippingType
  }
}

export function useStatement() {
  const state = ref<IState>({
    filter: {
      search: '',
      rangeDate: {
        from: '',
        to: '',
      },
      recharge: false,
    },
    isGrid: true,
    list: [],
    options: {
      clients: [],
    },
  })

  const { loaderStatus } = useLoader()
  const { isAdmin } = useRoles()

  const loader = {
    fetch: 'fetch-dasdd12fg4g',
  }

  async function fetch() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await StatementService.getAll(state.value.client)
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.fetch],
    })
  }

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        state.value.options.clients = await UserService.getAll()
      },
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.fetch],
    })
  }

  function filterToList(list: IStatement[]) {
    const { rangeDate, search, shippingType, recharge } = state.value.filter

    const startDate = new Date(rangeDate.from.split('/').reverse().join('-'))
    const endDate = new Date(rangeDate.to.split('/').reverse().join('-'))

    return list.filter((item) => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0)

      const matchShippingType =
        shippingType != undefined ? item.type == shippingType : true
      const matchSearch = search ? item.description === search : true
      const matchRangeDate = rangeDate.to
        ? itemDate >= startDate && itemDate <= endDate
        : true
      const matchRecharge = recharge ? item.value > 0 : true

      return matchShippingType && matchSearch && matchRangeDate && matchRecharge
    })
  }

  const currentList = computed(() => {
    return filterToList(state.value.list)
  })

  return {
    state,
    loader,
    currentList,
    fetch,
    isAdmin,
    fetchOptions,
    filterToList,
    loaderStatus,
  }
}
