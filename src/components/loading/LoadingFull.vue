<template>
  <div
    v-if="loaderStatusMultiple(loaderIds)"
    class="fullscreen flex flex-center z-max bg-black-1 loading-full-screen"
  >
    <div class="q-loading__box column items-center">
      <q-spinner color="white" size="5em" />
      <div class="q-loading__message">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoader } from '../../composables/useLoader'

interface IProps {
  text: string
  loaderIds: string[]
}

defineProps<IProps>()

const { loaderStatusMultiple } = useLoader()
</script>

<style lang="scss" scoped>
.loading-full-screen {
  background-color: rgba($dark, 0.4);
}
</style>
