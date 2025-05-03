<template>
  <q-carousel
    v-model="state.slide"
    transition-prev="scale"
    transition-next="scale"
    animated
    control-color="white"
    navigation
    padding
    height="250px"
    class="text-white rounded-borders"
  >
    <q-carousel-slide
      v-for="(item, idx) in state.texts"
      :name="`${idx}`"
      :key="idx"
      class="column no-wrap flex-center"
    >
      <div class="q-mt-md text-center">{{ item }}</div>
      <div class="flex gap-md q-mt-lg">
        <q-btn
          color="negative"
          label="Reprovar"
          unelevated
          @click="handleRemove(idx)"
        />
        <q-btn
          color="positive"
          label="Aprovar"
          unelevated
          @click="
            () => {
              emit('addSuggestedMessage', item)
              handleRemove(idx)
            }
          "
        />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

interface IProps {
  texts: string[]
}

interface IState {
  slide: string
  texts: string[]
}

function handleRemove(index: number) {
  state.value.texts = state.value.texts.filter((_, idx) => idx != index)

  if (!state.value.texts.length) {
    emit('closeSeggestedMessage')
  }
}

const props = defineProps<IProps>()
const emit = defineEmits(['addSuggestedMessage', 'closeSeggestedMessage'])

const state = ref<IState>({
  slide: '0',
  texts: props.texts,
})

watch(
  () => props.texts,
  (v) => (state.value.texts = v),
)
</script>
