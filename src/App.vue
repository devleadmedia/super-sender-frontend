<template>
  <router-view />
</template>

<script setup lang="ts">
import { useInterface } from './composables/useInterface'
import { useSettingMeta } from './composables/useMetaHtml'
import { useQuasarLangComponents } from './composables/useQuasarLangComponents'

const { startInterfaceConfig } = useInterface()
const { setupLangComponents } = useQuasarLangComponents()
const { titlePage } = useSettingMeta()

startInterfaceConfig()
setupLangComponents()
titlePage('Super Sender')

defineOptions({
  name: 'App',
})
</script>
