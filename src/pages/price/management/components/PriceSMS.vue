<template>
  <q-card-section class="q-pt-none">
    <div class="flex justify-between items-end full-width q-my-sm">
      <p class="q-mb-none">Tabela de preços</p>

      <q-btn
        outline
        label="Nova tabela"
        color="secondary"
        size="md"
        @click="addTablePrice"
      />
    </div>
    <q-separator class="q-mb-md" />
    <q-scroll-area style="height: 500px">
      <template v-for="(table, tableIdx) in localValue" :key="tableIdx">
        <div class="border">
          <div class="flex no-wrap gap-md">
            <q-input
              label="Nome"
              v-bind="$vInput"
              v-model="table.name"
              type="text"
              required
              class="full-width"
            />
            <q-btn
              icon="close"
              color="negative"
              outline
              @click="removeTablePrice(tableIdx)"
            />
          </div>
          <q-markup-table class="q-mt-md" separator="cell" flat dense bordered>
            <thead>
              <tr>
                <th class="text-left">Tipo de disparo</th>
                <th class="text-left">Tipo de SMS</th>
                <th class="text-left">Rota</th>
                <th class="text-right">Valor</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in table.data" :key="idx">
                <td class="text-left">
                  <q-select
                    v-model="item.typeShot"
                    v-bind="$vSelect"
                    borderless
                    :outlined="false"
                    :options="typeShotSMSOptions"
                  />
                </td>
                <td class="text-left">
                  <q-select
                    v-model="item.typeSMS"
                    v-bind="$vSelect"
                    borderless
                    :outlined="false"
                    :options="typeSMSOptions"
                  />
                </td>
                <td class="text-left">
                  <q-select
                    v-model="item.typeRoute"
                    v-bind="$vSelect"
                    borderless
                    :outlined="false"
                    :options="typeRouteSMSOptions"
                  />
                </td>
                <td class="text-right">
                  <div class="flex justify-end">
                    <q-input
                      v-model="item.value"
                      v-bind="$vInput"
                      style="width: 80px"
                      type="number"
                      borderless
                      :outlined="false"
                      required
                    />
                  </div>
                </td>
                <td class="text-right">
                  <q-btn
                    @click="removeTablePriceItem(tableIdx, idx)"
                    :disable="table.data.length == 1"
                    icon="close"
                    color="negative"
                    size="sm"
                    dense
                  >
                    <q-tooltip>Remover</q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <div class="flex justify-center items-center full-width q-mt-sm">
            <q-btn
              outline
              label="Adicionar"
              color="secondary"
              dense
              size="sm"
              @click="addTablePriceItem(tableIdx)"
            />
          </div>
        </div>
        <q-separator v-if="localValue.length != tableIdx + 1" class="q-my-md" />
      </template>
    </q-scroll-area>
  </q-card-section>
</template>

<script setup lang="ts">
import {
  typeRouteSMSOptions,
  typeShotSMSOptions,
  typeSMSOptions,
} from 'src/constants/shot/typesShot.const'
import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import type { IDataSMS, ITablePrice } from 'src/types/price/ITablePrice.type'
import { ref } from 'vue'

interface IProps {
  modelValue: ITablePrice<IDataSMS>[]
}

const props = defineProps<IProps>()

const localValue = ref<ITablePrice<IDataSMS>[]>([...props.modelValue])

function addTablePrice() {
  localValue.value.push({
    name: 'Novo',
    data: [
      {
        typeRoute: TypeRouteSMS.shortCode,
        typeShot: TypeShotSMS.oneWay,
        typeSMS: TypeSMS.flash,
        value: 0,
      },
    ],
  })
}

function removeTablePrice(tableIdx: number) {
  localValue.value = localValue.value.filter((_, idx) => idx != tableIdx)
}

function addTablePriceItem(tableIdx: number) {
  if (!localValue.value[tableIdx]) return
  else
    localValue.value[tableIdx].data.push({
      typeRoute: TypeRouteSMS.shortCode,
      typeShot: TypeShotSMS.oneWay,
      typeSMS: TypeSMS.flash,
      value: 0,
    })
}

function removeTablePriceItem(tableIdx: number, index: number) {
  if (!localValue.value[tableIdx]) return
  else
    localValue.value[tableIdx].data = localValue.value[tableIdx].data.filter(
      (_, idx) => idx != index,
    )
}
</script>
