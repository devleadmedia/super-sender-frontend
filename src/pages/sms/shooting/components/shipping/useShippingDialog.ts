import * as ShippingSMSService from 'src/services/sms/shippingSMS.service'
import * as CarrierService from 'src/services/sms/carrier/carrier.service'
import type { ShippingStatusSMS } from 'src/enums/shipping/ShippingStatusSMS.enum'
import requester from 'src/helpers/requester/Requester.helper'
import { ref } from 'vue'
import type { IShippingSMS } from 'src/types/sms/IShippingSMS.type'
import type { ICarrier } from 'src/types/sms/ICarrier.type'
import { useLoader } from 'src/composables/useLoader'
import { codeOptions } from 'src/constants/sms/codes.const'
import type { IOption } from 'src/types/IOption.type'
import { useDialog } from 'src/composables/useDialog'
import { IShootingSMS } from 'src/types/sms/IShootingSMS.type'
import { exportFile } from 'src/utils/download.util'

interface IState {
  list: IShippingSMS[]
  filter: {
    search: string
    code: number[]
    carrier: number[]
    status: ShippingStatusSMS[]
    reply?: boolean
  }
  options: {
    carriers: ICarrier[]
    codes: IOption<number>[]
  }
  optionsData: {
    codes: IOption<number>[]
    carriers: ICarrier[]
  }
  messageDialog: IShippingSMS | null
}

export function useShippingDialog() {
  const initState: IState = {
    list: [],
    filter: {
      search: '',
      carrier: [],
      code: [],
      status: [],
    },
    options: {
      carriers: [],
      codes: codeOptions,
    },
    optionsData: {
      carriers: [],
      codes: codeOptions,
    },
    messageDialog: null,
  }

  const loader = {
    shipping: 'shipping-gh343f2',
    downloadShipping: 'downloadShipping-asdfgreh45',
  }

  const dialog = {
    reply: 'reply-d143g34g23',
    message: 'message-d143g34g23',
  }

  const state = ref<IState>(initState)

  const { loaderStatus } = useLoader()
  const { toggleDialog } = useDialog()

  async function fetchList(shootingId: string) {
    await requester.dispatch({
      callback: async () => {
        if (state.value.optionsData.carriers.length == 0) {
          const carriers = await CarrierService.getAll()
          state.value.options.carriers = carriers
          state.value.optionsData.carriers = carriers
        }

        state.value.list = await ShippingSMSService.getAll(
          shootingId,
          state.value.filter.search,
          state.value.filter.carrier,
          state.value.filter.code,
          state.value.filter.status,
          state.value.filter.reply,
        )
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.shipping],
    })
  }

  function openMessageDialog(shipping: IShippingSMS) {
    state.value.messageDialog = shipping
    toggleDialog(dialog.message)
  }

  async function downloadShipping(item: IShootingSMS) {
    await requester.dispatch({
      callback: async () => {
        const file = await ShippingSMSService.exportItem(item.id)
        exportFile(`${item.name.trim()}.xlsx`, file)
      },
      successCallback: async () => {},
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.downloadShipping],
    })
  }

  return {
    state,
    dialog,
    loader,
    fetchList,
    toggleDialog,
    loaderStatus,
    downloadShipping,
    openMessageDialog,
  }
}
