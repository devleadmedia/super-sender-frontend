<template>
  <q-page class="container q-layout-padding">
    <div class="text-center text-h6">Tabela de preços</div>

    <div class="flex justify-center">
      <q-btn-group push class="q-mt-md">
        <q-btn
          push
          label="SMS"
          icon="sms"
          :class="isActiveCss(ShippingType.sms)"
          @click="setShippingType(ShippingType.sms)"
        />
        <q-btn
          push
          label="Email"
          icon="mail"
          :class="isActiveCss(ShippingType.email)"
          @click="setShippingType(ShippingType.email)"
        />
        <q-btn
          push
          label="Whatsapp"
          icon="phone"
          :class="isActiveCss(ShippingType.whatsapp)"
          @click="setShippingType(ShippingType.whatsapp)"
        />
      </q-btn-group>
    </div>

    <table-price-skeleton v-if="loaderStatus(loader.fetch)" />
    <template v-else>
      <TableSMS v-if="isActive(ShippingType.sms)" :tables="state.listSMS" />
      <TableEmail
        v-if="isActive(ShippingType.email)"
        :tables="state.listEmail"
      />
      <TableWhatsapp
        v-if="isActive(ShippingType.whatsapp)"
        :tables="state.listWhatsapp"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PriceService from 'src/services/price.service'
import type {
  IDataEmail,
  IDataSMS,
  IDataWhatsapp,
  ITablePrice,
} from 'src/types/price/ITablePrice.type'
import TablePriceSkeleton from './components/TablePriceSkeleton.vue'
import { useLoader } from 'src/composables/useLoader'
import { ShippingType } from 'src/enums/ShippingType.enum'
import TableSMS from './components/TableSMS.vue'
import TableEmail from './components/TableEmail.vue'
import TableWhatsapp from './components/TableWhatsapp.vue'

interface IState {
  shippingType: ShippingType
  listSMS: ITablePrice<IDataSMS>[]
  listEmail: ITablePrice<IDataEmail>[]
  listWhatsapp: ITablePrice<IDataWhatsapp>[]
}

const state = ref<IState>({
  listSMS: [],
  listEmail: [],
  listWhatsapp: [],
  shippingType: ShippingType.sms,
})

const { loaderStatus } = useLoader()

const loader = {
  fetch: 'fetch-d32g43g1g',
}

async function fetch() {
  await requester.dispatch({
    callback: async () => {
      const { tableEmail, tableSMS, tableWhatsapp } =
        await PriceService.getTablePrice()

      state.value.listSMS = tableSMS
      state.value.listEmail = tableEmail
      state.value.listWhatsapp = tableWhatsapp
    },
    errorMessageTitle: 'Houve um erro',
    errorMessage: 'Não foi possível realizar a ação',
    loaders: [loader.fetch],
  })
}

function setShippingType(shippingType: ShippingType) {
  state.value.shippingType = shippingType
}

function isActiveCss(shippingType: ShippingType) {
  return state.value.shippingType === shippingType ? 'bg-primary' : ''
}

function isActive(shippingType: ShippingType) {
  return state.value.shippingType === shippingType
}

onMounted(async () => {
  await fetch()
})
</script>
