<template>
  <q-card v-bind="$vCard">
    <q-card-section class="flex justify-between items-center">
      <div class="flex items-center gap-md">
        <q-btn
          size="sm"
          color="accent"
          round
          outline
          :icon="shippingTypeDictionary[item.type as ShippingType].icon"
          :title="shippingTypeDictionary[item.type as ShippingType].name"
        />
        <span> {{ item.description }} </span>
      </div>
      <span class="text-right">
        <p
          class="q-mb-none text-caption text-bold"
          :class="colorNumber(item.value)"
        >
          {{ moneyFormat(item.value) }}
        </p>
        <p class="q-mb-none text-caption text-grey">
          {{ formatDate(item.date) }}
        </p>
      </span>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { shippingTypeDictionary } from 'src/constants/shippingType.const'
import type { ShippingType } from 'src/enums/ShippingType.enum'
import type { IStatement } from 'src/types/statement/IStatement.type'
import { formatDate } from 'src/utils/date.util'
import { moneyFormat } from 'src/utils/money.util'

interface IProps {
  item: IStatement
}

defineProps<IProps>()

function colorNumber(value: number) {
  return value > 0 ? 'text-green' : 'text-red'
}
</script>
