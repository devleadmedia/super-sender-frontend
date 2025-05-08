<template>
  <template v-if="!state.chatMode">
    <div class="flex gap-md q-mb-sm">
      <span>TOTAL: {{ currentCountSMS.length }} </span>
      |<span>MENSAGENS: {{ currentCountSMS.messages }} </span>|
      <span>RESTANTE: {{ currentCountSMS.remaining }} </span>
    </div>

    <q-field label="Mensagem" outlined stack-label>
      <editor-content
        v-if="editorInstance"
        :editor="editorInstance"
        style="color: white; min-height: 50px"
        class="full-height full-width q-pb-sm"
      />
    </q-field>
  </template>

  <div v-else class="full-width">
    <q-separator class="q-my-md" />
    <p>Visualização de mensagens</p>
    <q-chat-message
      v-for="(text, idx) in currentCountSMS.splitSMS"
      :key="idx"
      :text="[text]"
      sent
      name="Super Sender"
    />

    <p v-if="!currentCountSMS.splitSMS.length" class="text-center">
      Escreva alguma mensagem...
    </p>
  </div>

  <div class="flex justify-end">
    <q-toggle label="Visualizar chat" v-model="state.chatMode" />
  </div>

  <q-separator v-if="state.infos.length" class="q-my-md" />

  <div class="row gap-sm">
    <div
      v-for="(item, idx) in state.infos"
      :key="idx"
      class="error-item flex justify-between items-center no-wrap full-width"
    >
      <div :class="`ping bg-${item.color}`" />
      <p class="full-width block q-mb-none">{{ item.label }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { ErrorHighlighter } from './highLighter.const'
import { Editor } from '@tiptap/core'
import { countSMS } from 'src/utils/sms.util'

interface IProps {
  modelValue: string
  listShadowBan: string[]
}

interface IState {
  infos: IItemInfo[]
  chatMode: boolean
}

interface IItemInfo {
  label: string
  color: string
  type: 'info' | 'error'
}

const props = defineProps<IProps>()

const state = ref<IState>({
  infos: [],
  chatMode: false,
})

const currentCountSMS = computed(() => countSMS(props.modelValue))

const emit = defineEmits(['update:modelValue', 'info'])

const editorInstance = useEditor({
  editable: true,
  content: props.modelValue ?? 'Evite escrever cavalo neste campo.',
  editorProps: {
    attributes: {
      class:
        'tiptap full-height overflow-auto focus:outline-none prose mx-auto',
      style: 'cursor: text;',
      spellcheck: 'false',
    },
  },
  onUpdate: ({ editor }) => {
    const text = editor.getText()

    handleInfo(editor, text)
    emit('update:modelValue', text)
    return text
  },
  extensions: [StarterKit, ErrorHighlighter(props.listShadowBan)],
})

function handleInfo(editor: Editor, text: string) {
  const infos: IItemInfo[] = []

  if (text.length > 139)
    infos.push({
      label:
        'Mensagens com mais de 139 caracteres estão sujeitas a shadowban pelas operadoras quando enviadas via rota Long Code.',
      color: 'warning',
      type: 'info',
    })

  if (editor.$doc.element.querySelectorAll('.error-word').length)
    infos.push({
      label: 'Remova ou substitua os destacados em vermelho.',
      color: 'negative',
      type: 'error',
    })

  if (editor.$doc.element.querySelectorAll('.variable-word').length)
    infos.push({
      label:
        'Variáveis foram adicionadas e serão substituidas pelos valores indicados.',
      color: 'info',
      type: 'info',
    })

  if (currentCountSMS.value.messages > 1)
    infos.push({
      label:
        'O envio de múltiplas mensagens consecutivas pode resultar em um aumento proporcional no consumo de créditos.',
      color: 'warning',
      type: 'info',
    })

  state.value.infos = infos
  emit(
    'info',
    infos.some((item) => item.type === 'error'),
  )
}

onBeforeUnmount(() => {
  editorInstance.value?.destroy()
})
</script>

<style lang="scss">
.error-word {
  background-color: rgba(255, 0, 0, 0.2);
  border-bottom: 1px dotted red;
  cursor: pointer;
}

.variable-word {
  background-color: rgba(0, 247, 255, 0.2);
  border-bottom: 1px solid rgb(0, 217, 255);
}

.error-item {
  border: 1px solid rgba(128, 128, 128, 0.432);
  border-radius: 4px;
  padding: 5px;

  .ping {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    margin: 10px;
    flex-shrink: 0;
  }

  p {
    font-size: 12px;
  }
}
</style>
