<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h6 text-left">Extrato</h1>

    <div class="flex items-center gap-md q-my-md" v-if="isAdmin()">
      <q-select
        style="flex-shrink: 0; width: 200px"
        label="Cliente"
        v-model="state.client"
        v-bind="$vSelect"
        optionValue="id"
        :options="state.options.clients"
        clearable
        :loading="loaderStatus(loader.fetch)"
      />
      <q-btn color="primary" label="Filtrar" @click="fetch" />
    </div>
    <q-separator />

    <div class="flex items-center justify-between q-mt-lg gap-md">
      <div class="flex items-center gap-md">
        <q-input
          v-bind="$vInput"
          debounce="300"
          v-model="state.filter.search"
          placeholder="Pesquisar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <date-range v-model:rangeDate="state.filter.rangeDate" />

        <q-select
          style="width: 200px"
          label="Tipo de envio"
          :options="shippingTypeOptions"
          clearable
          v-bind="$vSelect"
          v-model="state.filter.shippingType"
        />
      </div>

      <div class="flex items-center gap-md"></div>
    </div>

    <q-separator class="q-mt-md" />

    <q-table
      v-bind="$vTable"
      :loading="loaderStatus(loader.fetch)"
      :rows="currentList"
      :columns="statementTableColumns"
      row-key="id"
      :grid="state.isGrid"
      :filter="state.filter.search"
      :rows-per-page-options="[8]"
    >
      <template v-slot:top-left> </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-12">
          <statement-item :item="props.row" />
        </div>
      </template>
    </q-table>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { statementTableColumns } from './statement.const'
import StatementItem from './components/StatementItem.vue'
import DateRange from 'src/components/date-picker/DateRange.vue'
import { shippingTypeOptions } from 'src/constants/shippingType.const'
import { useStatement } from './useStatement'

const {
  state,
  loader,
  currentList,
  fetch,
  isAdmin,
  loaderStatus,
  fetchOptions,
} = useStatement()

onMounted(async () => {
  await fetch()
  await fetchOptions()
})
</script>
