<template>
  <v-dialog
    maximized
    full-width
    full-heigth
    :dialog-id="dialogId"
    @before-show="beforeShow"
    :persistent="false"
  >
    <template #default>
      <q-card
        style="max-width: 1400px; min-height: 400px"
        class="shadow-0 full-width"
        bordered
      >
        <q-card-section
          class="flex justify-between items-center q-py-none q-pt-sm"
        >
          <h6 class="text-h6 q-my-none">
            Detalhes de envio do disparo {{ shooting?.name }}
          </h6>

          <q-btn @click="toggleDialog(dialogId)" icon="close" round flat>
            <q-tooltip>Fechar</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section>
          <div class="flex items-center justify-between q-mt-lg gap-md q-mb-md">
            <div class="flex items-center gap-md">
              <q-input
                outlined
                dense
                debounce="300"
                placeholder="Pesquisar"
                v-model="state.filter.search"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-select
                style="width: 200px"
                label="DDD"
                :options="state.options.codes"
                clearable
                v-bind="$vSelect"
                v-model="state.filter.code"
                multiple
                use-input
                @filter="
                  (v, update) => {
                    update(
                      () =>
                        (state.options.codes = filterFn(
                          v,
                          'name',
                          state.optionsData.codes,
                        )),
                    )
                  }
                "
              />

              <q-select
                style="width: 200px"
                label="Status"
                :options="shippingStatusOptions"
                clearable
                v-bind="$vSelect"
                v-model="state.filter.status"
              />

              <q-select
                style="width: 200px"
                label="Operadoras"
                :options="state.options.carriers"
                clearable
                v-bind="$vSelect"
                v-model="state.filter.carrier"
                use-input
                multiple
                @filter="
                  (v, update) => {
                    update(
                      () =>
                        (state.options.carriers = filterFn(
                          v,
                          'name',
                          state.optionsData.carriers,
                        )),
                    )
                  }
                "
              />

              <q-select
                style="width: 200px"
                label="Replica"
                :options="replyOptions"
                clearable
                v-bind="$vSelect"
                v-model="state.filter.reply"
              />

              <q-btn
                label="Aplicar filtro"
                color="primary"
                @click="fetchList(shooting!.id)"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section align="right">
          <q-btn
            label="Exportar"
            color="secondary"
            outline
            :loading="loaderStatus(loader.downloadShipping)"
            @click="downloadShipping(shooting!)"
          />
        </q-card-section>

        <q-card-section>
          <q-table
            flat
            dense
            bordered
            :rows="currentList"
            :columns="shippingSMSTableColumns"
            :rows-per-page-options="[20]"
            :loading="loaderStatus(loader.shipping)"
            style="height: 500px"
            virtual-scroll
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  :icon="
                    shippingStatusDictionary[
                      props.row.status as ShippingStatusSMS
                    ].icon
                  "
                  :color="
                    props.row.status == ShippingStatusSMS.read
                      ? 'blue'
                      : undefined
                  "
                >
                  <q-tooltip>
                    <p class="q-mb-none">
                      Status:
                      {{
                        shippingStatusDictionary[
                          props.row.status as ShippingStatusSMS
                        ].name
                      }}
                    </p>
                    <p class="q-mb-none" v-if="props.row.sentAt">
                      {{ `Enviado ${formatDate(props.row.sentAt)}` }}
                    </p>
                    <p class="q-mb-none" v-if="props.row.deliveredAt">
                      {{ `Recebido ${formatDate(props.row.deliveredAt)}` }}
                    </p>
                  </q-tooltip>
                </q-btn>

                <q-btn
                  :title="props.row.message"
                  flat
                  round
                  dense
                  icon="message"
                  @click="openMessageDialog(props.row)"
                >
                  <q-badge
                    v-if="props.row.replies.length"
                    color="primary"
                    floating
                    >{{ props.row.replies.length }}</q-badge
                  >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-card-section align="right">
          <q-btn flat label="Fechar" @click="closeShippingDialog" />
        </q-card-section>
      </q-card>
    </template>
  </v-dialog>

  <v-dialog :dialog-id="dialog.message">
    <template #default>
      <q-card v-bind="$vCard" style="max-width: 400px" class="full-width">
        <q-card-section>
          <p class="text-h6 q-mb-none">Mensagem</p>
          <p class="q-mb-none text-grey">
            Telefone:
            {{
              `(${state.messageDialog?.ddd}) ${state.messageDialog?.phoneNumber}`
            }}
          </p>
        </q-card-section>

        <q-card-section>
          <q-chat-message
            name="Super Sender"
            sent
            :text="[state.messageDialog?.message]"
            :stamp="
              state.messageDialog?.sentAt
                ? formatDate(state.messageDialog.sentAt)
                : '-'
            "
          />
          <q-chat-message
            v-for="(item, idx) in state.messageDialog?.replies"
            :key="idx"
            name="Cliente"
            :text="[item.content]"
            :stamp="formatDate(item.receivedAt)"
          />
        </q-card-section>

        <q-separator />
        <q-card-section align="right">
          <q-btn flat label="Fechar" @click="toggleDialog(dialog.message)" />
        </q-card-section>
      </q-card>
    </template>
  </v-dialog>
</template>
<script setup lang="ts">
import VDialog from 'src/components/dialog/VDialog.vue'
import { computed } from 'vue'
import { shippingSMSTableColumns } from '../../shootingSMS.const'
import {
  shippingStatusDictionary,
  shippingStatusOptions,
} from 'src/constants/shipping/shippingStatusSMS.const'
import { ShippingStatusSMS } from 'src/enums/shipping/ShippingStatusSMS.enum'
import { useShippingDialog } from './useShippingDialog'
import { replyOptions } from 'src/constants/sms/reply.const'
import { filterFn } from 'src/utils/filter.util'
import type { IShootingSMS } from 'src/types/sms/IShootingSMS.type'
import { formatDate } from 'src/utils/date.util'

interface IProps {
  dialogId: string
  loaderId: string
  shooting: IShootingSMS | null
}
const props = defineProps<IProps>()

const {
  state,
  loader,
  dialog,
  fetchList,
  loaderStatus,
  toggleDialog,
  downloadShipping,
  openMessageDialog,
} = useShippingDialog()

function closeShippingDialog() {
  state.value.list = []
  toggleDialog(props.dialogId)
}

const currentList = computed(() => {
  return state.value.list
})

async function beforeShow() {
  if (props.shooting != null) await fetchList(props.shooting.id)
}
</script>
