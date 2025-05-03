<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Remetentes</h1>

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
      :columns="senderTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novos remetentes"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openCreateDialog"
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
      :name-items="
        state.actionsData.map((item) => `(${item.ddd}) ${item.number}`)
      "
      prefix="as"
      title="associações"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.create" @clear-dialog="clearCreateDialog">
      <template #default>
        <q-card
          v-bind="$vCard"
          style="max-width: 500px"
          class="full-width"
          bordered
        >
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">Editar remetente</h6>

            <q-uploader
              class="shadow-0 q-my-md full-width"
              bordered
              @added="addSenderFile"
              max-files="1"
              hide-upload-btn
              @removed="removeSenderFile"
              accept=".xlsx"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              color="default"
              flat
              label="Cancelar"
              @click="toggleDialog(dialog.create)"
              :disable="loaderStatus(loader.edit)"
            />

            <q-btn
              color="primary"
              label="Salvar"
              unelevated
              type="submit"
              :disable="!state.formCreate"
              :loading="loaderStatus(loader.edit)"
              @click="save"
            />
          </q-card-actions>
        </q-card>
      </template>
    </v-dialog>

    <v-dialog :dialog-id="dialog.edit" @clear-dialog="clearEditDialog">
      <template #default>
        <q-card style="max-width: 500px" class="shadow-0 full-width" bordered>
          <q-form @submit="save">
            <q-card-section class="q-py-none q-pt-sm">
              <h6 class="text-h6 q-my-none">Editar remetente</h6>
            </q-card-section>

            <q-card-section class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  label="DDD"
                  v-bind="$vInput"
                  v-model="state.form.ddd"
                  mask="##"
                  unmasked-value
                  :rules="[requiredRule, (v) => numberLengthRule(v, 2)]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  label="Número"
                  mask="#########"
                  v-bind="$vInput"
                  v-model="state.form.number"
                  unmasked-value
                  :rules="[requiredRule, (v) => numberLengthRule(v, 9)]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  label="Operador"
                  v-bind="$vInput"
                  v-model="state.form.operator"
                  :rules="[requiredRule]"
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
import { senderTableColumns } from './sender.const'
import { useSender } from './useSender'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import { statusOptions } from 'src/constants/status.const'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import { onMounted } from 'vue'
import { numberLengthRule } from 'src/validations/form-rules/numberRules.util'

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
  downloadTemplate,
  openCreateDialog,
  openActionDialog,
  clearCreateDialog,
} = useSender()

function addSenderFile(files: readonly File[]) {
  const [file] = files
  state.value.formCreate = file || null
}

function removeSenderFile() {
  state.value.formCreate = null
}

onMounted(() => fetchList())
</script>
