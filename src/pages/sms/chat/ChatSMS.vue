<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Chat SMS</h1>

    <q-card
      v-bind="$vCard"
      class="overflow-hidden"
      style="height: 80vh; display: flex"
    >
      <q-card-section
        class="q-pa-none flex-col"
        style="width: 280px; flex-shrink: 0"
      >
        <sidebar-left />
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="q-pa-none full-width" style="display: flex">
        <div class="flex-col full-width">
          <chat-component />
        </div>
      </q-card-section>
    </q-card>

    <action-dialog
      :action-type="ActionDialogOptions.delete"
      :dialog-id="dialog.delete"
      :loader-action-id="loader.delete"
      :name-items="[formatPhoneNumber(state.actionData?.telephone || '')]"
      prefix="o"
      title="chat do contato"
      @confirm-action="deleteChat(state.actionData!.contactId)"
    />
    <loading-full :loader-ids="[loader.favorite]" text="Carregando..." />
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useChatSMS } from './useChatSMS'
import ChatComponent from './components/chat/ChatComponent.vue'
import SidebarLeft from './components/sidebar-left/SidebarLeft.vue'
import LoadingFull from 'src/components/loading/LoadingFull.vue'
import { dialog, loader } from './chatSMS.const'
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { formatPhoneNumber } from 'src/utils/text.util'

const { fetchList, resetState, deleteChat, state } = useChatSMS()

onMounted(async () => {
  await fetchList()
})

onUnmounted(() => resetState())
</script>
