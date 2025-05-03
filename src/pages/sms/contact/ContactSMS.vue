<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Contatos de SMS</h1>

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

      <q-btn
        color="secondary"
        outline
        label="Baixar exemplo"
        @click="downloadTemplate"
      />
    </div>

    <q-table
      flat
      dense
      bordered
      selection="multiple"
      v-model:selected="state.actionsData"
      :rows="state.list"
      :columns="messageSMSTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo contato"
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
          <q-btn
            icon="download"
            :disable="loaderStatus(loader.downloadContact)"
            flat
            round
            @click="downloadContact(props.row)"
          >
            <q-tooltip> Baixar planilha </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.title)"
      prefix="os"
      title="contatos"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @clear-dialog="clearEditDialog">
      <template #default>
        <q-card style="max-width: 500px" class="shadow-0 full-width" bordered>
          <q-form @submit="save">
            <q-card-section class="q-py-none q-pt-sm">
              <h6 class="text-h6 q-my-none">
                {{ state.form.id ? 'Editar' : 'Criar' }} contato
              </h6>
            </q-card-section>

            <q-card-section class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-bind="$vInput"
                  v-model="state.form.title"
                  label="Titulo"
                  :rules="[requiredRule]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  label="Cliente"
                  :rules="[requiredRule]"
                  v-bind="$vSelect"
                  v-model="state.form.clientId"
                  :options="state.options.clients"
                  option-value="id"
                  :disable="!!state.form.id"
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
              <div class="col-12">
                <q-uploader
                  class="shadow-0 q-my-md full-width"
                  bordered
                  max-files="1"
                  hide-upload-btn
                  @added="addContactFile"
                  @removed="removeContactFile"
                  accept=".xlsx"
                />
              </div>
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
                type="submit"
                unelevated
                :disable="!state.form.file && !state.form.id"
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
import { onMounted } from 'vue'
import { messageSMSTableColumns } from './contactSMS.const'
import { useContactSMS } from './useContactSMS'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'

const {
  state,
  loader,
  dialog,
  save,
  fetchList,
  toggleDialog,
  loaderStatus,
  confirmAction,
  addContactFile,
  openEditDialog,
  downloadContact,
  clearEditDialog,
  downloadTemplate,
  openActionDialog,
  removeContactFile,
} = useContactSMS()

onMounted(() => fetchList())
</script>
