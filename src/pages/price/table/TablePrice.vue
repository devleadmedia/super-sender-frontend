<template>
  <q-page class="container q-layout-padding">
    <q-card v-bind="$vCard" class="q-pa-lg shadow-2">
      <q-card-section class="text-center">
        <div class="text-h6">Tabela de preços</div>
      </q-card-section>

      <table-price-skeleton v-if="loaderStatus(loader.fetch)" />

      <q-card-section v-for="(table, tableIdx) in state.list" :key="tableIdx">
        <div class="text-subtitle1 text-bold">{{ table.name }}</div>
        <q-markup-table separator="cell" flat bordered>
          <thead>
            <tr>
              <th class="text-left">Tipo de disparo</th>
              <th class="text-left">Tipo de SMS</th>
              <th class="text-left">Rota</th>
              <th class="text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in table.data" :key="idx">
              <td class="text-left">
                {{ typeShotDictionary[item.typeShot].name }}
              </td>
              <td class="text-left">
                {{ typeSMSDictionary[item.typeSMS].name }}
              </td>
              <td class="text-left">
                {{ typeRouteDictionary[item.typeRoute].name }}
              </td>
              <td class="text-right">
                {{
                  item.value.toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <q-separator class="q-mt-xl" v-if="state.list.length != tableIdx + 1" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PriceService from 'src/services/price.service'
import type { ITablePrice } from 'src/types/price/ITablePrice.type'
import {
  typeRouteDictionary,
  typeShotDictionary,
  typeSMSDictionary,
} from 'src/constants/shot/typesShot.const'
import TablePriceSkeleton from './TablePriceSkeleton.vue'
import { useLoader } from 'src/composables/useLoader'

interface IState {
  list: ITablePrice[]
}

const state = ref<IState>({
  list: [],
})

const { loaderStatus } = useLoader()

const loader = {
  fetch: 'fetch-d32g43g1g',
}

async function fetch() {
  await requester.dispatch({
    callback: async () => {
      state.value.list = await PriceService.getTablePrice()
    },
    successMessageTitle: 'Concluído com sucesso',
    errorMessageTitle: 'Houve um erro',
    errorMessage: 'Não foi possível realizar a ação',
    loaders: [loader.fetch],
  })
}

onMounted(async () => {
  await fetch()
})
</script>
