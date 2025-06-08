<template>
  <q-menu>
    <q-list separator>
      <q-item v-close-popup clickable>
        <q-item-section> Favoritar </q-item-section>
      </q-item>
      <q-item v-close-popup clickable class="text-negative" @click="emit('deleteConversation', () => '')">
        <q-item-section> Deletar </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
const emit = defineEmits(['deleteConversation'])
</script>
