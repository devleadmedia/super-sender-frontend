<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Templates de mensagem - Whatsapp</h1>

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
      :name-items="state.actionsData.map((item) => item.title)"
      prefix="as"
      title="mensagens"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.openImage">
      <q-card v-bind="$vCard" style="width: 500px">
        <q-img fit="contain" height="600px" :src="state.openImageURL" />

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            color="default"
            flat
            label="Cancelar"
            @click="toggleDialog(dialog.openImage)"
          />
        </q-card-actions>
      </q-card>
    </v-dialog>

    <v-dialog
      :dialog-id="dialog.edit"
      @before-hide="clearEditDialog"
      full-height
    >
      <template #default>
        <q-card
          style="max-width: 800px; height: 100%"
          class="flex-col justify-between shadow-0 full-width"
          bordered
        >
          <q-card-section class="">
            <h6 class="text-h6 q-my-none q-mb-md">
              {{ state.form.id ? 'Editar' : 'Criar' }} mensagem
            </h6>

            <div class="row q-col-gutter-md">
              <input
                v-show="false"
                ref="fileInput"
                @change="handleFileChange"
                type="file"
                :accept="filePermissionsWhatsapp.join(',')"
              />

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
            </div>

            <p class="q-mb-none">Visualização de mensagens</p>
          </q-card-section>

          <div
            v-if="
              state.form.fileURL && state.form.typeFile == CurrentTypeFile.audio
            "
            class="flex justify-center items-center"
          >
            <div class="border-divisor">
              <audio-whatsapp
                :src="state.form.fileURL"
                :wave-width="200"
                :wave-height="20"
                load-audio-onmount
              />
            </div>
          </div>

          <video
            class="rounded-borders bg-black"
            controls
            v-if="
              state.form.fileURL && state.form.typeFile == CurrentTypeFile.video
            "
            :src="state.form.fileURL"
            style="height: 100%"
            :autoplay="false"
          ></video>

          <q-img
            v-if="
              state.form.fileURL && state.form.typeFile == CurrentTypeFile.image
            "
            :src="state.form.fileURL"
            class="full-height"
            fit="contain"
          />

          <document-whatsapp
            v-if="
              state.form.fileDocument &&
              state.form.fileURL &&
              state.form.typeFile == CurrentTypeFile.document
            "
            v-bind="state.form.fileDocument"
          />

          <q-infinite-scroll
            v-if="!state.form.fileURL"
            ref="infiniteScroll"
            class="border-divisor full-height q-pa-md overflow-auto"
            reverse
          >
            <q-chat-message
              v-for="(item, index) in state.form.messagens"
              :key="index"
              sent
              class="chat-message"
              :bg-color="
                state.form.messageEdit?.id == item.id ? 'secondary' : undefined
              "
            >
              <template #default>
                <div>
                  <audio-whatsapp
                    v-if="item.audioURL"
                    :src="item.audioURL"
                    :wave-width="200"
                    :wave-height="20"
                    load-audio-onmount
                    played-line-color="#000000"
                    noplayed-line-color="#80808066"
                  />

                  <video
                    class="rounded-borders"
                    controls
                    v-if="item.videoURL"
                    :src="item.videoURL"
                    width="330px"
                  ></video>

                  <q-img
                    v-if="item.imageURL"
                    :src="item.imageURL"
                    @click="openImage(item.imageURL)"
                    fit="cover"
                    width="200px"
                    height="200px"
                    class="q-mb-sm rounded-borders cursor-pointer"
                  />

                  <document-whatsapp
                    v-if="item.document"
                    v-bind="item.document"
                    class="bg-grey"
                  />

                  <div v-html="formatMessage(item.message)"></div>

                  <div class="button-options-chat" :id="`more-icon-${index}`">
                    <q-btn
                      size="xs"
                      dense
                      unelevated
                      color="primary"
                      icon="expand_more"
                      class="btn-more-options"
                    >
                      <q-menu
                        dense
                        auto-close
                        v-bind="$vMenu"
                        anchor="bottom right"
                        self="top right"
                        :target="`#more-icon-${index}`"
                      >
                        <q-list dense separator>
                          <q-item
                            clickable
                            v-ripple
                            v-if="
                              !item.audioURL &&
                              !item.imageURL &&
                              !item.videoURL &&
                              !item.document
                            "
                            @click="selectEditMessage(item)"
                          >
                            <q-item-section>Editar</q-item-section>
                          </q-item>
                          <q-item
                            @click="removeMessage(item.id)"
                            clickable
                            v-ripple
                            class="text-negative"
                          >
                            <q-item-section>Deletar</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </template>
            </q-chat-message>
          </q-infinite-scroll>

          <div>
            <div class="q-my-md q-mx-sm">
              <q-input
                :disable="disableChatMessage()"
                type="textarea"
                v-model="state.form.currentMessage"
                v-bind="$vInput"
                rows="2"
              >
                <template v-slot:before>
                  <q-btn
                    v-if="state.form.messageEdit"
                    color="negative"
                    icon="close"
                    round
                    unelevated
                    dense
                    @click="cancelEditMessage"
                  >
                    <q-tooltip>Remover arquivo</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else-if="state.form.file"
                    color="negative"
                    icon="close"
                    round
                    unelevated
                    dense
                    @click="removeCurrentFile"
                  >
                    <q-tooltip>Remover arquivo</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else
                    @click="openFile"
                    round
                    dense
                    flat
                    icon="attach_file"
                  ></q-btn>
                </template>
                <template v-slot:after>
                  <q-btn
                    :disable="disableSendInput()"
                    @click="addMessage"
                    round
                    dense
                    flat
                    icon="send"
                  />
                </template>
              </q-input>
            </div>

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
                @click="save"
                :disable="state.form.messagens.length === 0"
                :loading="loaderStatus(loader.edit)"
              />
            </q-card-actions>
          </div>
        </q-card>
      </template>
    </v-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import {
  CurrentTypeFile,
  messageSMSTableColumns,
} from './messageWhatsapp.const'
import { useMessageSMS } from './useMessageWhatsapp'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import { filePermissionsWhatsapp } from 'src/constants/whatsapp/permissionsFile.const'
import AudioWhatsapp from 'src/components/audio/AudioWhatsapp.vue'
import DocumentWhatsapp from 'src/components/whatsapp/document/DocumentWhatsapp.vue'
// import AudioTest from 'src/assets/faz-o-l-vinheta.mp3'

const {
  state,
  loader,
  dialog,
  fileInput,
  infiniteScroll,
  save,
  openFile,
  openImage,
  fetchList,
  addMessage,
  toggleDialog,
  loaderStatus,
  confirmAction,
  removeMessage,
  openEditDialog,
  clearEditDialog,
  disableSendInput,
  handleFileChange,
  openActionDialog,
  removeCurrentFile,
  selectEditMessage,
  cancelEditMessage,
  disableChatMessage,
} = useMessageSMS()

function formatMessage(text: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<s>$1</s>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

onMounted(() => fetchList())
</script>
<style lang="scss">
.border-divisor {
  border: 1px solid $separator-color;
  border-radius: 4px;
}

.button-options-chat {
  position: absolute;
  right: 0;
  top: 0;
}

.chat-message {
  .q-message-text:last-child {
    min-height: 0px;
  }

  .btn-more-options {
    display: none;
  }

  .q-message-container > div:hover .btn-more-options {
    display: initial;
  }
}
</style>
