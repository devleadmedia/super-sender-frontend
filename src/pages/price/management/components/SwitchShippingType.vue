<template>
  <q-btn-group v-if="shippingTypeOptions.length" push class="q-mt-md">
    <q-btn
      v-for="(shipping, idx) in shippingTypeOptions"
      :key="idx"
      push
      :label="shippingTypeDictionary[shipping].name"
      :icon="shippingTypeDictionary[shipping].icon"
      :class="isActiveClass(shipping)"
      @click="emit('setShippingType', shipping)"
    />
  </q-btn-group>
  <q-chip v-else color="accent" outline label="Selecione um cliente" />
</template>
<script setup lang="ts">
import { shippingTypeDictionary } from 'src/constants/shippingType.const'
import type { ShippingType } from 'src/enums/ShippingType.enum'

interface IProps {
  shippingType: ShippingType
  shippingTypeOptions: ShippingType[]
}

const props = defineProps<IProps>()
const emit = defineEmits(['setShippingType'])

function isActiveClass(shippingType: ShippingType) {
  return props.shippingType === shippingType ? 'bg-primary' : ''
}
</script>
