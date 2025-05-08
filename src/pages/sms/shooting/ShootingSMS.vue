<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Disparos de SMS</h1>

    <div class="flex items-center justify-between q-mt-lg gap-md q-mb-md">
      <div class="flex items-center gap-md">
        <q-select
          v-if="isAdmin()"
          style="width: 200px"
          label="Cliente"
          :options="state.options.users"
          clearable
          v-bind="$vSelect"
          v-model="state.filter.user"
          use-input
          option-value="id"
          @filter="
            (v, update) =>
              update(
                () =>
                  (state.options.users = filterFn(
                    v,
                    'name',
                    state.optionsData.users,
                  )),
              )
          "
        />

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

        <date-range v-model:rangeDate="state.filter.rangeDate" />

        <q-select
          style="width: 200px"
          label="Status"
          :options="shootingStatusSMSOptions"
          clearable
          v-bind="$vSelect"
          v-model="state.filter.status"
        />

        <q-select
          style="width: 200px"
          label="Tipo de disparo"
          :options="typeShotSMSOptions"
          clearable
          v-bind="$vSelect"
          v-model="state.filter.typeShot"
        />

        <q-select
          style="width: 200px"
          label="Tipo de SMS"
          :options="typeSMSOptions"
          clearable
          v-bind="$vSelect"
          v-model="state.filter.typeSMS"
        />

        <q-select
          style="width: 200px"
          label="Tipo de SMS"
          :options="typeRouteSMSOptions"
          clearable
          v-bind="$vSelect"
          v-model="state.filter.typeRoute"
        />

        <q-btn label="Aplicar filtro" @click="fetchList" color="primary" />
      </div>
    </div>

    <q-table
      flat
      dense
      bordered
      :rows="state.list"
      :columns="shootingSMSTableColumns"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
      v-model:pagination="state.pagination"
      @request="onRequestTable"
      ref="tableRef"
      style="height: 500px"
      virtual-scroll
    >
      <template #top-right>
        <action-header
          hide-actions
          label-new-entity="Novo disparo"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="
              shootingStatusSMSDictionary[props.row.status as ShootingStatusSMS]
                .color
            "
            :label="
              shootingStatusSMSDictionary[props.row.status as ShootingStatusSMS]
                .name
            "
          />
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            icon="info"
            flat
            round
            @click="openShippingDialog(props.row)"
          >
            <q-tooltip> Detalhes </q-tooltip>
          </q-btn>
          <q-btn
            dense
            :disable="props.row.status != ShootingStatusSMS.scheduled"
            icon="edit"
            flat
            round
            @click="openEditDialog(props.row)"
          >
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
          <q-btn
            dense
            :icon="
              props.row.status == ShootingStatusSMS.paused
                ? 'play_arrow'
                : 'pause'
            "
            flat
            round
            :disable="
              canPausedOrPlayerShot(
                props.row.status == ShootingStatusSMS.paused,
                props.row.status,
              )
            "
            @click="
              openActionDialog(
                props.row.status == ShootingStatusSMS.paused
                  ? ActionDialogOptions.play
                  : ActionDialogOptions.pause,
                props.row,
              )
            "
          >
            <q-tooltip>
              {{
                props.row.status == ShootingStatusSMS.paused
                  ? 'Retomar'
                  : 'Pausar'
              }}
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            icon="cancel"
            flat
            round
            :disabled="canCancelShot(props.row.status)"
            @click="openActionDialog(ActionDialogOptions.cancel, props.row)"
          >
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
          <q-btn
            dense
            icon="delete"
            flat
            round
            :disabled="canDeleteShot(props.row.status)"
            @click="openActionDialog(ActionDialogOptions.delete, props.row)"
          >
            <q-tooltip>Deletar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="o"
      title="disparo"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @before-hide="clearEditDialog">
      <template #default>
        <q-card style="max-width: 800px" class="shadow-0 full-width" bordered>
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} disparo
            </h6>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <q-stepper
              v-model="state.step"
              class="shadow-0 q-ma-none"
              color="primary"
              animated
            >
              <q-step
                :name="step.config"
                title="Configurações disparo"
                icon="settings"
              >
                <q-form @submit="sendRequest">
                  <shooting-form
                    v-model="state.form"
                    :options="state.options"
                  />

                  <q-stepper-navigation align="right">
                    <q-btn
                      flat
                      @click="toggleDialog(dialog.edit)"
                      :disable="loaderStatus(loader.edit)"
                      color="primary"
                      label="Cancelar"
                      class="q-mr-sm"
                    />

                    <q-btn
                      :loading="loaderStatus(loader.edit)"
                      color="primary"
                      label="Continuar"
                      type="submit"
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>

              <q-step :name="step.cost" title="Confirmar operação" icon="check">
                <insufficient-balance v-if="state.resultSendRequest == null" />
                <cost-operation v-else :value="state.resultSendRequest" />

                <q-stepper-navigation align="right">
                  <q-btn
                    flat
                    @click="state.step = step.config"
                    color="primary"
                    label="Voltar"
                    class="q-mr-sm"
                  />

                  <q-btn
                    v-if="state.resultSendRequest == null"
                    color="primary"
                    label="Comprar créditos"
                  />

                  <q-btn
                    v-else
                    @click="confirmShooting"
                    color="primary"
                    label="Finalizar"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </q-card-section>
        </q-card>
      </template>
    </v-dialog>

    <shipping-dialog
      :loader-id="loader.shipping"
      :dialog-id="dialog.shipping"
      :shooting="state.shippingDialog.shooting"
    />
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { shootingSMSTableColumns } from './shootingSMS.const'
import { ShootingStatusSMS } from 'src/enums/shot/ShootingStatusSMS.type'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { useShootingSMS } from './useShootingSMS'
import {
  shootingStatusSMSDictionary,
  shootingStatusSMSOptions,
} from 'src/constants/shot/shootingStatusSMS.const'
import {
  typeRouteSMSOptions,
  typeShotSMSOptions,
  typeSMSOptions,
} from 'src/constants/shot/typesShot.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import DateRange from 'src/components/date-picker/DateRange.vue'
import ShippingDialog from './components/shipping/ShippingDialog.vue'
import ShootingForm from './components/form/ShootingForm.vue'
import InsufficientBalance from './components/message/InsufficientBalance.vue'
import CostOperation from './components/message/CostOperation.vue'
import { filterFn } from 'src/utils/filter.util'
import { QTable } from 'quasar'

const {
  step,
  state,
  loader,
  dialog,
  isAdmin,
  fetchList,
  sendRequest,
  toggleDialog,
  loaderStatus,
  canCancelShot,
  canDeleteShot,
  confirmAction,
  onRequestTable,
  openEditDialog,
  confirmShooting,
  clearEditDialog,
  openActionDialog,
  openShippingDialog,
  canPausedOrPlayerShot,
} = useShootingSMS()

const tableRef = ref<QTable | null>(null)

onMounted(async () => {
  await fetchList()
  tableRef.value?.requestServerInteraction()
})
</script>
