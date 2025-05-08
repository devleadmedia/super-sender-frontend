<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Remetentes por cliente</h1>

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
      :columns="senderByClientTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Nova associação"
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
      prefix="as"
      title="associações"
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
                {{ state.form.id ? 'Editar' : 'Criar' }} associação
              </h6>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    label="Cliente"
                    :rules="[requiredRule]"
                    v-bind="$vSelect"
                    v-model="state.form.client"
                    :options="state.options.clients"
                    option-value="id"
                    :disable="!!state.form.id"
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
              </div>

              <association-table
                v-model="state.form.senders"
                :options="state.options.senders"
              />
            </q-card-section>

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
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { senderByClientTableColumns } from './senderByClient.const'
import { useSenderByClient } from './useSenderByClient'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import { statusOptions } from 'src/constants/status.const'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import { onMounted } from 'vue'
import AssociationTable from './components/AssociationTable.vue'

const {
  state,
  loader,
  dialog,
  save,
  fetchList,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
} = useSenderByClient()

onMounted(() => fetchList())
</script>
