<template>
  <div v-for="(table, tableIdx) in tables" :key="tableIdx" class="q-pa-lg">
    <div class="text-subtitle1 text-bold">{{ table.name }}</div>
    <q-markup-table separator="cell" flat bordered>
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Mensagem</th>
          <th class="text-left">Rota</th>
          <th class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in table.data" :key="idx">
          <td class="text-left">
            {{ typeShotSMSDictionary[item.typeShot].name }}
          </td>
          <td class="text-left">
            {{ typeRouteSMSDictionary[item.typeRoute].name }}
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
  </div>
</template>
<script setup lang="ts">
import {
  typeRouteSMSDictionary,
  typeShotSMSDictionary,
} from 'src/constants/shot/typesShot.const'
import type { IDataSMS, ITablePrice } from 'src/types/price/ITablePrice.type'

interface IProps {
  tables: ITablePrice<IDataSMS>[]
}

defineProps<IProps>()
</script>
