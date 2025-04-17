<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Mensagens</h1>

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
      :columns="messageSMSTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Nova mensagem"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        >
          <template #before>
            <q-btn
              @click="openTriggerDialog"
              label="Trigger Words"
              color="secondary"
            />
          </template>
        </action-header>
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
      :name-items="state.actionsData.map((item) => item.title)"
      prefix="as"
      title="mensagens"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.triggerWord">
      <q-card style="max-width: 500px" class="shadow-0 full-width" bordered>
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">Trigger Words</h6>
          </q-card-section>

          <q-card-section>
            <q-input
              v-bind="$vInput"
              debounce="300"
              placeholder="Pesquisar"
              v-model="state.triggerSearch"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section>
            <q-scroll-area
              visible
              :thumb-style="{
                borderRadius: '7px',
                backgroundColor: 'grey',
                width: '8px',
                opacity: '0.75',
              }"
              :bar-style="{
                right: '0px',
                borderRadius: '9px',
                backgroundColor: 'grey',
                width: '8px',
                opacity: '0.2',
              }"
              style="height: 600px"
            >
              <div
                v-for="(item, idx) in triggerWordList"
                :key="idx"
                class="q-mr-sm"
              >
                <p class="q-mb-none">{{ item?.category }}</p>
                <q-separator class="q-my-sm" />
                <ul class="q-mb-lg">
                  <li v-for="(word, wordIdx) in item?.data" :key="wordIdx">
                    {{ word }}
                  </li>
                </ul>
              </div>
            </q-scroll-area>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              color="default"
              flat
              label="Cancelar"
              @click="toggleDialog(dialog.triggerWord)"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </v-dialog>

    <v-dialog :dialog-id="dialog.edit" @clear-dialog="clearEditDialog">
      <template #default>
        <q-card style="max-width: 500px" class="shadow-0 full-width" bordered>
          <q-form @submit="save">
            <q-card-section class="q-py-none q-pt-sm">
              <h6 class="text-h6 q-my-none">
                {{ state.form.id ? 'Editar' : 'Criar' }} mensagem
              </h6>
            </q-card-section>

            <q-card-section class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-bind="$vInput"
                  label="Titulo"
                  v-model="state.form.title"
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
              <div class="col-12">
                <message-input v-model="state.form.message" />
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
import { onMounted } from 'vue'
import { messageSMSTableColumns } from './messageSMS.const'
import { useMessageSMS } from './useMessageSMS'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import MessageInput from './components/MessageInput.vue'

const {
  state,
  loader,
  dialog,
  triggerWordList,
  save,
  fetchList,
  toggleDialog,
  loaderStatus,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
  openTriggerDialog,
} = useMessageSMS()

onMounted(() => fetchList())
</script>
