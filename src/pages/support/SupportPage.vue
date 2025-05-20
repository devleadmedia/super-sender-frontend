<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Suporte</h1>

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
      :columns="supportTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <q-btn
          icon="add"
          label="Novo chamado"
          color="primary"
          unelevated
          split
          :disable="loaderStatus(loader.list)"
          @click="openRequestDialog"
          v-if="isClient()"
        />
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="
              supportStatusDictionary[props.row.status as SupportStatus].color
            "
            :label="
              supportStatusDictionary[props.row.status as SupportStatus].name
            "
          />
        </q-td>
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
      prefix="os"
      title="chamados"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.openRequest" @before-hide="clearEditDialog">
      <template #default>
        <q-card style="max-width: 500px" class="shadow-0 full-width" bordered>
          <q-form @submit="create">
            <q-card-section class="q-py-none q-pt-sm">
              <h6 class="text-h6 q-my-none">
                {{ state.form.id ? 'Editar' : 'Criar' }} chamado
              </h6>
            </q-card-section>

            <q-card-section class="row">
              <div class="col-12">
                <q-input
                  v-bind="$vInput"
                  v-model="state.openRequestForm.title"
                  label="Titulo"
                  :rules="[requiredRule]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-bind="$vInput"
                  v-model="state.openRequestForm.description"
                  label="Descrição"
                  type="textarea"
                  :rules="[requiredRule]"
                />
              </div>
              <div class="col-12">
                <q-uploader
                  class="shadow-0 q-my-md full-width"
                  bordered
                  max-files="1"
                  hide-upload-btn
                  @added="addRequestFormFile"
                  @removed="removeRequestFormFile"
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
                @click="toggleDialog(dialog.openRequest)"
                :disable="loaderStatus(loader.openRequest)"
              />
              <q-btn
                color="primary"
                label="Salvar"
                type="submit"
                unelevated
                :loading="loaderStatus(loader.openRequest)"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </template>
    </v-dialog>

    <v-dialog :dialog-id="dialog.edit" @before-hide="clearEditDialog">
      <template #default>
        <q-card style="max-width: 600px" class="shadow-0 full-width" bordered>
          <q-card-section class="q-py-none q-pt-sm">
            <div class="flex justify-between items-start">
              <span>
                <h6 class="text-h6 q-my-none">
                  <b class="text-grey">#{{ state.form.id }}</b>
                  {{ state.form.title }}
                </h6>
                <p class="text-caption">{{ state.form.description }}</p>
              </span>

              <q-btn
                icon="close"
                round
                flat
                dense
                @click="toggleDialog(dialog.edit)"
              />
            </div>
          </q-card-section>

          <template v-if="isAdmin()">
            <q-separator />
            <q-card-section>
              <span class="flex gap-sm">
                <p class="q-mb-none">ID: {{ state.form.requester.id }}</p>
                <b>|</b>
                <p class="q-mb-none">
                  CLIENTE: {{ state.form.requester.name }}
                </p>
              </span>
              <div class="flex justify-between q-mt-md gap-md no-wrap">
                <q-select
                  v-bind="$vSelect"
                  v-model="state.form.status"
                  class="full-width"
                  label="Status"
                  :options="supportStatusOptions"
                />

                <q-btn
                  style="flex-shrink: 0"
                  label="Atualizar status"
                  color="primary"
                  @click="updateStatus"
                />
              </div>
            </q-card-section>
          </template>

          <q-separator />

          <q-card-section>
            <q-infinite-scroll
              reverse
              class="full-width overflow-auto"
              style="height: 400px"
              ref="infiniteScroll"
            >
              <div
                class="q-mx-md"
                v-for="(item, idx) in state.form.messages"
                :key="idx"
              >
                <q-chat-message
                  v-for="(image, idx) in item.images"
                  :key="idx"
                  :sent="state.form.requester.id !== item.userId"
                  :stamp="formatDate(state.form.date)"
                >
                  <div>
                    <img
                      :src="image"
                      style="max-width: 200px; border-radius: 4px"
                      alt="Descrição da imagem"
                    />
                  </div>
                </q-chat-message>

                <q-chat-message
                  :text="[item.message]"
                  :sent="state.form.requester.id !== item.userId"
                  :stamp="formatDate(state.form.date)"
                />
              </div>
            </q-infinite-scroll>
          </q-card-section>
          <q-separator />

          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            style="display: none"
            accept="image/*"
            multiple
          />

          <q-card-section v-if="state.form.previews.length" class="q-pb-none">
            <q-scroll-area horizontal style="height: 80px" class="full-width">
              <div class="row no-wrap gap-sm">
                <q-card
                  v-bind="$vCard"
                  v-for="(image, idx) in state.form.previews"
                  :key="idx"
                  dense
                >
                  <div class="relative">
                    <q-img
                      :src="image"
                      height="75px"
                      width="75px"
                      fit="contain"
                    />
                    <q-btn
                      style="right: 4px; top: 4px"
                      class="absolute"
                      size="10px"
                      color="negative"
                      round
                      icon="close"
                      dense
                      @click="removeItemPreview(idx)"
                    />
                  </div>
                </q-card>
              </div>
            </q-scroll-area>

            <p
              v-if="hasExceededMaxImageSizeLimit()"
              class="text-negative q-mb-none"
            >
              Limite de envio de {{ MAX_LIMIT_MB }}MB foi ultrapassado, remova
              algumas imagens
            </p>
          </q-card-section>
          <q-card-section v-if="state.form.status == SupportStatus.pending">
            <q-input
              v-bind="$vInput"
              v-model="state.form.currentMessage"
              placeholder="Escreva uma mensagem"
            >
              <template #after>
                <q-btn
                  round
                  dense
                  flat
                  icon="attach_file"
                  title="Anexar"
                  @click="triggerFileInput"
                />

                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  type="submit"
                  :disable="
                    !state.form.currentMessage && !state.form.files.length
                  "
                  @click="sendMessage"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-inner-loading :showing="loaderStatus(loader.edit)">
            <q-spinner color="primary" size="3em" />
          </q-inner-loading>
        </q-card>
      </template>
    </v-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { MAX_LIMIT_MB, supportTableColumns } from './support.const'
import { useSupport } from './useSupport'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import {
  supportStatusDictionary,
  supportStatusOptions,
} from 'src/constants/support/supportStatus.const'
import { SupportStatus } from 'src/enums/support/SupportStatus.enum'
import { formatDate } from 'src/utils/date.util'
import { useRoles } from 'src/composables/useRoles'

const {
  state,
  loader,
  dialog,
  fileInput,
  infiniteScroll,
  sendMessage,
  create,
  fetchList,
  updateStatus,
  toggleDialog,
  loaderStatus,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  triggerFileInput,
  handleFileChange,
  removeItemPreview,
  openRequestDialog,
  addRequestFormFile,
  removeRequestFormFile,
  hasExceededMaxImageSizeLimit,
} = useSupport()

const { isAdmin, isClient } = useRoles()

onMounted(async () => {
  await fetchList()
})
</script>
