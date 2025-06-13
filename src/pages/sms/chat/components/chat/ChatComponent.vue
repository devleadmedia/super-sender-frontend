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
          <menu-options :contact="state.chat.contact" />
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

    <div class="q-pt-sm q-px-md">
      <message-sms
        :disable-chat="state.chat.totalCredits != null"
        hide-chat-mode
        v-model="state.chat.currentMessage"
        :list-shadow-ban="state.triggerWords.map((w) => w.name)"
        class="full-width"
        @errors="state.chat.errors = $event"
      />
    </div>
    <div
      v-if="state.chat.totalCredits"
      class="q-px-md q-py-md flex justify-between items-center gap-sm"
    >
      <p class="q-mb-none">
        O custo da mensagem será de
        <b>{{ moneyFormat(state.chat.totalCredits) }}</b> créditos, deseja
        prosseguir?
      </p>
      <span class="q-gutter-sm" style="flex-shrink: 0">
        <q-btn label="Cancelar" @click="cancelSendMessage" flat />
        <q-btn
          :loading="loaderStatus(loader.confirmSendMessage)"
          label="Confirmar"
          color="primary"
          @click="confirmSendMessage"
        />
      </span>
    </div>

    <div v-else class="q-px-md q-py-md flex justify-end">
      <q-btn
        :loading="loaderStatus(loader.sendMessage)"
        label="Enviar"
        color="primary"
        @click="sendMessage"
        :disable="state.chat.errors > 0 || !state.chat.currentMessage.trim()"
      />
    </div>
  </div>

  <initial-chat v-else />
</template>
<script setup lang="ts">
import { formatPhoneNumber } from 'src/utils/text.util'
import MenuOptions from '../menu-options/MenuOptions.vue'
import InitialChat from './InitialChat.vue'
import { formatDate } from 'src/utils/date.util'
import { useChatSMS } from '../../useChatSMS'
import { loader } from '../../chatSMS.const'
import MessageSms from 'src/components/message-sms/MessageSMS.vue'
import { moneyFormat } from 'src/utils/money.util'

const {
  state,
  infiniteScroll,
  sendMessage,
  loaderStatus,
  cancelSendMessage,
  confirmSendMessage,
} = useChatSMS()
</script>
