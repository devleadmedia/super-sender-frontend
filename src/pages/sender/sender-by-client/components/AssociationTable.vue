<template>
  <q-table
    flat
    dense
    bordered
    row-key="id"
    title="Remetentes"
    selection="multiple"
    v-model:selected.number="state.modelValue"
    :rows="state.selectedSender ? state.modelValue : state.options"
    :columns="associationTableColumns"
    :filter="state.search"
    :rows-per-page-options="[20]"
    class="full-width"
    style="height: 400px"
    @update:selected="updateSender"
  >
    <template #top-right>
      <div class="flex gap-md">
        <q-toggle v-model="state.selectedSender" label="Selecionados" />
        <q-input
          outlined
          dense
          debounce="300"
          placeholder="Pesquisar"
          v-model="state.search"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn icon="add" flat round>
          <q-tooltip> Adicionar </q-tooltip>
        </q-btn>
        <q-btn icon="close" flat round>
          <q-tooltip> Remover </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import type { ISender } from 'src/types/sender/ISender.type'
import { associationTableColumns } from '../senderByClient.const'
import { ref } from 'vue'

interface IProps {
  modelValue: ISender[]
  options: ISender[]
}

interface IState extends IProps {
  search: string
  selectedSender: boolean
}

const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])

const state = ref<IState>({
  ...props,
  search: '',
  selectedSender: false,
})

function updateSender(senders: readonly ISender[]) {
  emit('update:modelValue', senders)
}
</script>
