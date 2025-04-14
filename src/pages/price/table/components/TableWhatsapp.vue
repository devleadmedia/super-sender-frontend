<template>
  <q-card v-bind="$vCard" class="text-center q-ma-lg">
    <p class="q-my-lg">Whatsapp ainda não disponivel</p>
  </q-card>
</template>
<script setup lang="ts">
import type {
  IDataWhatsapp,
  ITablePrice,
} from 'src/types/price/ITablePrice.type'

interface IProps {
  tables: ITablePrice<IDataWhatsapp>[]
}

defineProps<IProps>()
</script>
