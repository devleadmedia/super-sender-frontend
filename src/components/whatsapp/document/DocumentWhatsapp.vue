<template>
  <q-list bordered class="rounded-borders">
    <q-item clickable v-ripple class="radiused-borders">
      <q-item-section avatar top>
        <q-avatar icon="folder" color="orange" text-color="white" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">
          {{ name }}
        </q-item-label>
        <q-item-label caption>
          {{ type }} •
          {{ size }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn flat round icon="download" :href="url" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
interface Props {
  name: string
  type: string
  size: string
  url: string
}
 defineProps<Props>()
</script>
