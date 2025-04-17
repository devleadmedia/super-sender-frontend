<template>
  <q-field
    v-bind="$vInput"
    v-model="text"
    label="Mensagem"
    maxlength="139"
    counter
    :rules="[requiredRule]"
  >
    <template v-slot:control="{ id, floatingLabel }">
      <textarea
        :id="id"
        class="q-field__input"
        style="resize: none; height: 100px"
        @input="(v: any) => handleMessageInput(v.target.value as string)"
        v-model="text"
        v-show="floatingLabel"
        maxlength="139"
      ></textarea>
    </template>
  </q-field>
</template>
<script setup lang="ts">
import { smsInput } from 'src/utils/sms.util'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { ref } from 'vue'

interface IProps {
  modelValue: string
}

function handleMessageInput(v: string){
  text.value = smsInput(v)
  emit('update:modelValue', text.value)
  return text.value
}

const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])

const text = ref(props.modelValue)

</script>
