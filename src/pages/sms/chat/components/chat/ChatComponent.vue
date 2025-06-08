<template>
  <div
    v-if="loaderStatus(loader.getMessagens)"
    class="flex justify-center items-center fit gap-md"
  >
    <q-spinner color="primary" size="3em" />
    <p class="q-mb-none">Carregando mensagens...</p>
  </div>

  <div v-else-if="state.chat" class="flex-col full-height">
    <div class="flex justify-between items-center q-px-md q-py-sm full-width">
      <span>
        <p class="q-mb-none"></p>
        <p class="q-mb-none">
          {{ formatPhoneNumber(state.chat.contact.telephone) }}
        </p>
      </span>

      <span class="q-gutter-sm" style="flex-shrink: 0">
        <q-btn icon="more_vert" round flat dense>
          <MenuOptions />
        </q-btn>
      </span>
    </div>

    <q-separator />

    <q-infinite-scroll
      reverse
      ref="infiniteScroll"
      class="full-height q-pa-md overflow-auto"
    >
      <q-chat-message
        v-for="(item, idx) in state.chat?.messagens"
        :key="idx"
        :text="[item.message]"
        :sent="item.contactId === state.chat?.contact.contactId"
        :stamp="formatDate(item.date)"
      />
    </q-infinite-scroll>

    <q-separator />

    <div class="q-pa-sm">
      <q-input v-bind="$vInput" v-model="va" placeholder="Escreva uma mensagem">
        <template #after>
          <q-btn round dense flat icon="send" type="submit" />
        </template>
      </q-input>
    </div>
  </div>

  <initial-chat v-else />
</template>
<script setup lang="ts">
import { formatPhoneNumber } from 'src/utils/text.util'
import { ref } from 'vue'
import MenuOptions from '../menu-options/MenuOptions.vue'
import InitialChat from './InitialChat.vue'
import { formatDate } from 'src/utils/date.util'
import { useChatSMS } from '../../useChatSMS'
import { loader } from '../../chatSMS.const'

const va = ref('')
const { state, infiniteScroll, loaderStatus } = useChatSMS()
</script>
