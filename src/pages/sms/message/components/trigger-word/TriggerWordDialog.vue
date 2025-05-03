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

        <q-scroll-area
          v-else
          visible
          v-bind="$vScrollArea"
          style="height: 400px"
        >
          <div
            v-for="(item, idx) in triggerWordList"
            :key="idx"
            class="q-mr-md"
          >
            <q-item v-ripple>
              <q-item-section>
                <q-item-label v-if="state.editTriggerWord.id == item.id">
                  <q-input
                    v-bind="$vInput"
                    v-model="state.editTriggerWord.name"
                  >
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
                        @click.stop="emit('triggerWordSave', { id: item.id })"
                      >
                        <q-tooltip>Salvar</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-item-label>
                <q-item-label v-else>
                  {{ item.name }}
                </q-item-label>
              </q-item-section>

              <q-item-section side v-if="isAdmin()">
                <div class="flex justify-center gap-md">
                  <q-btn
                    v-if="state.editTriggerWord.id != item.id"
                    @click.stop="state.editTriggerWord = cloneDeep(item)"
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
                    @dblclick.stop="emit('triggerWordDelete', item)"
                  >
                    <q-tooltip>Clique 2X para Deletar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
          </div>
        </q-scroll-area>
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
import { normalizeText } from 'src/utils/text.util'
import { computed, ref } from 'vue'

interface IProps {
  dialogId: string
  loaderId: string
  listTriggerWords: ITriggerWord[]
}

const props = defineProps<IProps>()
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

const triggerWordList = computed(() => {
  const { triggerSearch } = state.value

  if (!triggerSearch) return props.listTriggerWords

  const lowerSearch = normalizeText(triggerSearch)

  return props.listTriggerWords.filter((item) => {
    const categoryMatches = lowerSearch
      ? normalizeText(item.name).includes(lowerSearch)
      : true

    return categoryMatches
  })
})
</script>
