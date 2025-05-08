<template>
  <v-dialog :dialog-id="dialogId">
    <q-card style="max-width: 500px" class="shadow-0 full-width" bordered>
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

      <q-card-section v-if="isAdmin()" class="flex no-wrap gap-md">
        <q-input
          class="full-width"
          v-bind="$vInput"
          v-model="state.newTriggerWord"
          clearable
          label="Novo trigger word"
        />
        <q-btn
          label="Criar"
          color="primary"
          :disable="!state.newTriggerWord"
          @click="
            () => {
              emit('triggerWordSave', { name: state.newTriggerWord })
              state.newTriggerWord = ''
            }
          "
        />
      </q-card-section>

      <q-card-section>
        <div v-if="loaderStatus(loaderId)">
          <template v-for="i in 5" :key="i">
            <q-item>
              <q-item-section>
                <q-skeleton width="50%" />
              </q-item-section>
              <q-item-section side>
                <q-skeleton width="50px" />
              </q-item-section>
            </q-item>
            <q-separator />
          </template>
        </div>

        <q-table
          flat
          dense
          bordered
          :rows="listTriggerWords"
          :columns="triggerWordTableColumns"
          :filter="state.triggerSearch"
          :loading="loaderStatus(loaderId)"
          :rows-per-page-options="[10]"
        >
          <template #body-cell-name="props">
            <q-td :props="props">
              <template v-if="state.editTriggerWord.id == props.row.id">
                <q-input v-bind="$vInput" v-model="state.editTriggerWord.name">
                  <template v-slot:append>
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      @click.stop="state.editTriggerWord.id = ''"
                    >
                      <q-tooltip>Cancelar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      icon="check"
                      @click.stop="
                        emit('triggerWordSave', { id: props.row.id })
                      "
                    >
                      <q-tooltip>Salvar</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </template>
              <template v-else>
                {{ props.row.name }}
              </template>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                v-if="state.editTriggerWord.id != props.row.id"
                @click.stop="state.editTriggerWord = cloneDeep(props.row)"
                round
                flat
                dense
                color="white"
                icon="edit"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                round
                flat
                dense
                color="white"
                icon="delete"
                @dblclick.stop="emit('triggerWordDelete', props.row)"
              >
                <q-tooltip>Clique 2X para Deletar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="default"
          flat
          label="Cancelar"
          @click="toggleDialog(dialogId)"
        />
      </q-card-actions>
    </q-card>
  </v-dialog>
</template>
<script setup lang="ts">
import VDialog from 'src/components/dialog/VDialog.vue'
import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { useRoles } from 'src/composables/useRoles'
import { ITriggerWord } from 'src/types/sms/ITriggerWord.type'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import { triggerWordTableColumns } from '../../messageSMS.const'

interface IProps {
  dialogId: string
  loaderId: string
  listTriggerWords: ITriggerWord[]
}

defineProps<IProps>()
const emit = defineEmits(['triggerWordSave', 'triggerWordDelete'])

const { toggleDialog } = useDialog()
const { isAdmin } = useRoles()
const { loaderStatus } = useLoader()

const state = ref({
  triggerSearch: '',
  editTriggerWord: {
    id: '',
    name: '',
  },
  newTriggerWord: '',
})
</script>
