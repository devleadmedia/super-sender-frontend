<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Gerenciar preços</h1>

    <div class="flex justify-between gap-md q-mb-lg">
      <q-input
        outlined
        dense
        debounce="300"
        placeholder="Pesquisar"
        v-model="state.filter"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-table
      flat
      dense
      bordered
      selection="multiple"
      v-model:selected="state.actionsData"
      :rows="state.list"
      :columns="priceManagementTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo preço"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="openEditDialog(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="os"
      title="preços"
      @clear-dialog="clearEditDialog"
      @confirm-action="confirmAction"
    />

    <edit-dialog
      :dialog-id="dialog.edit"
      :loader-id="loader.edit"
      :disable-save="false"
      :is-edit="!state.form.id"
      max-width="1000px"
      name="preço"
      @clear-edit-dialog="clearEditDialog"
      @submit="save"
    >
      <template #content>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              label="Nome"
              :rules="[requiredRule]"
              v-model="state.form.name"
              v-bind="$vInput"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              label="Cliente"
              :rules="[requiredRule]"
              v-bind="$vSelect"
              v-model="state.form.client"
              :options="state.options.clients"
              option-value="id"
            />
          </div>
          <div class="col-12" v-if="state.form.id">
            <q-select
              label="Status"
              :rules="[requiredRule]"
              v-bind="$vSelect"
              v-model="state.form.status"
              :options="statusOptions"
            />
          </div>
        </q-card-section>

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
            <template
              v-for="(table, tableIdx) in state.form.tablePrice"
              :key="tableIdx"
            >
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
                    :disable="state.form.tablePrice.length == 1"
                  />
                </div>
                <q-markup-table class="q-mt-md" separator="cell" flat bordered>
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
                          :options="typeShotOptions"
                        />
                      </td>
                      <td class="text-left">
                        <q-select
                          v-model="item.typeSMS"
                          v-bind="$vSelect"
                          :options="typeSMSOptions"
                        />
                      </td>
                      <td class="text-left">
                        <q-select
                          v-model="item.typeRoute"
                          v-bind="$vSelect"
                          :options="typeRouteOptions"
                        />
                      </td>
                      <td class="text-right">
                        <div class="flex justify-end">
                          <q-input
                            v-model="item.value"
                            v-bind="$vInput"
                            style="width: 80px"
                            type="number"
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

                <div
                  class="flex justify-center items-center full-width q-mt-sm"
                >
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
              <q-separator
                v-if="state.form.tablePrice.length != tableIdx + 1"
                class="q-my-md"
              />
            </template>
          </q-scroll-area>
        </q-card-section>
      </template>
    </edit-dialog>
  </q-page>
</template>
<script setup lang="ts">
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import EditDialog from 'src/components/dialog/EditDialog.vue'
import { onMounted } from 'vue'
import { usePriceManagement } from './usePriceManagement'
import { priceManagementTableColumns } from './priceManagement.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import {
  typeRouteOptions,
  typeShotOptions,
  typeSMSOptions,
} from 'src/constants/shot/typesShot.const'

const {
  state,
  dialog,
  loader,
  save,
  fetchList,
  loaderStatus,
  createDialog,
  confirmAction,
  addTablePrice,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
  removeTablePrice,
  addTablePriceItem,
  removeTablePriceItem,
} = usePriceManagement()

onMounted(async () => {
  await fetchList()
  createDialog([dialog.edit])
})
</script>
<style lang="scss" scoped>
.border {
  border: 1px $separator-color solid;
  border-radius: $generic-border-radius;
  padding: 12px;
}
</style>
