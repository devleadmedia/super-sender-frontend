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
      :name-items="state.actionsData.map((item) => item.client.name)"
      prefix="os"
      title="preços"
      @confirm-action="confirmAction"
    />

    <v-dialog
      full-width
      maximized
      :dialog-id="dialog.edit"
      @before-hide="clearEditDialog"
    >
      <template #default>
        <q-card style="max-width: 200px" class="shadow-0 full-width" bordered>
          <q-form @submit="save">
            <q-card-section class="q-py-none q-pt-sm">
              <h6 class="text-h6 q-my-none">
                {{ state.form.id ? 'Editar' : 'Criar' }} preço
              </h6>
            </q-card-section>

            <q-card-section class="row q-col-gutter-md q-py-none">
              <div class="col-12 col-md-6">
                <q-select
                  label="Cliente"
                  :rules="[requiredRule]"
                  v-bind="$vSelect"
                  v-model="state.form.client"
                  :options="state.options.clients"
                  option-value="id"
                  :disable="!!state.form.id"
                  @update:model-value="updateClient"
                />
              </div>
              <div class="col-12 col-md-6" v-if="state.form.id">
                <q-select
                  label="Status"
                  :rules="[requiredRule]"
                  v-bind="$vSelect"
                  v-model="state.form.status"
                  :options="statusOptions"
                />
              </div>
            </q-card-section>

            <q-card-section>
              <p class="q-mb-none">Selecionar o tipo de envio</p>
              <SwitchShippingType
                @set-shipping-type="setShippingType"
                :shipping-type="state.form.shippingTypeStep"
                :shipping-type-options="state.form.shippingType"
              />
            </q-card-section>

            <PriceSMS
              v-if="isActive(ShippingType.sms)"
              v-model="state.form.tablePriceSMS"
            />

            <PriceEmail
              v-if="isActive(ShippingType.email)"
              v-model="state.form.tablePriceEmail"
            />

            <PriceEmail
              v-if="isActive(ShippingType.whatsapp)"
              v-model="state.form.tablePriceWhatsapp"
            />

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                color="default"
                flat
                label="Cancelar"
                @click="toggleDialog(dialog.edit)"
                :disable="loaderStatus(loader.edit)"
              />
              <q-btn
                color="primary"
                label="Salvar"
                unelevated
                type="submit"
                :loading="loaderStatus(loader.edit)"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </template>
    </v-dialog>
  </q-page>
</template>
<script setup lang="ts">
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import { onMounted } from 'vue'
import { usePriceManagement } from './usePriceManagement'
import { priceManagementTableColumns } from './priceManagement.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'

import VDialog from 'src/components/dialog/VDialog.vue'
import SwitchShippingType from './components/SwitchShippingType.vue'
import PriceSMS from './components/PriceSMS.vue'
import { ShippingType } from 'src/enums/ShippingType.enum'
import PriceEmail from './components/PriceEmail.vue'

const {
  state,
  dialog,
  loader,
  save,
  isActive,
  fetchList,
  loaderStatus,
  updateClient,
  toggleDialog,
  confirmAction,
  openEditDialog,
  setShippingType,
  clearEditDialog,
  openActionDialog,
} = usePriceManagement()

onMounted(async () => {
  await fetchList()
})
</script>
<style lang="scss" scoped>
.border {
  border: 1px $separator-color solid;
  border-radius: $generic-border-radius;
  padding: 12px;
}
</style>
