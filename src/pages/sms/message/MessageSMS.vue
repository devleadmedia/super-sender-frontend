<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Templates de mensagem - SMS</h1>

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

    <trigger-word-dialog
      :dialog-id="dialog.triggerWord"
      :loader-id="loader.triggerWord"
      :list-trigger-words="state.triggerWords"
      @trigger-word-delete="triggerWordDelete"
      @trigger-word-save="triggerWordSave"
    />

    <v-dialog :dialog-id="dialog.edit" @before-hide="clearEditDialog">
      <template #default>
        <q-card style="max-width: 800px" class="shadow-0 full-width" bordered>
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
                <q-select
                  label="Campanha"
                  :rules="[requiredRule]"
                  v-bind="$vSelect"
                  v-model="state.form.campaignId"
                  :options="state.options.campaigns"
                  option-value="id"
                />
              </div>

              <div class="col-12">
                <message-input
                  v-model="state.form.message"
                  :list-shadow-ban="state.triggerWords.map((t) => t.name)"
                  @info="hasErrorMessage"
                />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <p>
                Mensagens sugeridas ({{ state.form.alternativeMessages.length }}
                / 15)
              </p>

              <q-btn
                label="Gerar textos similares"
                color="primary"
                outline
                :disable="
                  state.form.message.length < 25 || state.hasErrorMessage
                "
                class="q-mb-md"
                @click="getAlternativeMessages"
              />

              <suggested-message
                v-if="state.options.alternativeMessages.length > 0"
                :texts="state.options.alternativeMessages"
                :disable-approved="state.form.alternativeMessages.length == 15"
                @add-suggested-message="addSuggestedMessage"
                @close-seggested-message="clearAlternativeMessageOptions"
              />

              <q-separator
                v-if="state.form.alternativeMessages.length"
                class="q-my-md"
              />

              <div class="row gap-md">
                <q-scroll-area
                  v-if="state.form.alternativeMessages.length"
                  visible
                  style="height: 200px"
                  class="full-width"
                >
                  <div
                    class="alternative-message-item flex q-mb-md items-center justify-between no-wrap q-mr-md"
                    v-for="(item, idx) in state.form.alternativeMessages"
                    :key="idx"
                  >
                    <span>{{ item }}</span>
                    <q-btn
                      round
                      icon="close"
                      flat
                      dense
                      color="negative"
                      @click="removeAlternativeMessage(idx)"
                    />
                  </div>
                </q-scroll-area>
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
import MessageInput from './components/message-input/MessageInput.vue'
import TriggerWordDialog from './components/trigger-word/TriggerWordDialog.vue'
import SuggestedMessage from './components/suggested-message/SuggestedMessage.vue'

const {
  state,
  loader,
  dialog,
  save,
  fetchList,
  toggleDialog,
  loaderStatus,
  confirmAction,
  openEditDialog,
  triggerWordSave,
  clearEditDialog,
  hasErrorMessage,
  openActionDialog,
  triggerWordDelete,
  openTriggerDialog,
  addSuggestedMessage,
  getAlternativeMessages,
  removeAlternativeMessage,
  clearAlternativeMessageOptions,
} = useMessageSMS()

onMounted(() => fetchList())
</script>
<style lang="scss">
.alternative-message-item {
  border: 1px solid $separator-color;
  border-radius: 4px;
  padding: 5px;
}
</style>
