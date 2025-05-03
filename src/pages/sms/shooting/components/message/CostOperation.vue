<template>
  <p class="text-bold">Custo da operação</p>
  <p>
    O custo total desse disparo é de
    {{ moneyFormat(value, true) }} créditos
  </p>
</template>
<script setup lang="ts">
import { moneyFormat } from 'src/utils/money.util'

interface IProps {
  value: number
}

defineProps<IProps>()
</script>
