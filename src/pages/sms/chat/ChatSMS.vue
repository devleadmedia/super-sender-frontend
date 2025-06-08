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
  </q-page>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatSMS } from './useChatSMS'
import ChatComponent from './components/chat/ChatComponent.vue'
import SidebarLeft from './components/sidebar-left/SidebarLeft.vue'

const { fetchList } = useChatSMS()

onMounted(async () => {
  await fetchList()
})
</script>
