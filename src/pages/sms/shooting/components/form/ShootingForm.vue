<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <date-picker label="Data disparo" dense v-model="v.date" rule-active />
    </div>
    <div class="col-12 col-md-6">
      <q-input
        v-bind="$vInput"
        v-model="v.name"
        label="Titulo"
        :rules="[requiredRule]"
      />
    </div>
    <div class="col-12 col-md-6">
      <q-select
        label="Tipo de disparo"
        :rules="[requiredRule]"
        v-bind="$vSelect"
        v-model="v.typeShot"
        :options="typeShotSMSOptions"
      />
    </div>
    <div class="col-12 col-md-6">
      <q-select
        label="Tipo de SMS"
        :rules="[requiredRule]"
        v-bind="$vSelect"
        v-model="v.typeSMS"
        :options="currentTypeSMSOptions"
      />
    </div>
    <div class="col-12">
      <q-select
        label="Tipo de rota"
        :rules="[requiredRule]"
        v-bind="$vSelect"
        v-model="v.typeRoute"
        :options="typeRouteSMSOptions"
      />
    </div>
    <div class="col-12">
      <q-select
        label="Lista de contatos"
        :rules="[requiredRule]"
        v-bind="$vSelect"
        v-model="v.contactIds"
        :options="options.contactSMS"
        option-label="title"
        option-value="id"
        multiple
        use-chips
      >
        <template v-slot:selected-item="scope">
          <chip-select :scope="scope" label="title" />
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <q-select
        label="Campanha"
        :rules="[requiredRule]"
        v-bind="$vSelect"
        v-model="v.campaignId"
        :options="options.campaigns"
        option-value="id"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import DatePicker from 'src/components/date-picker/DatePicker.vue'
import {
  typeRouteSMSOptions,
  typeShotSMSOptions,
  typeSMSOptions,
} from 'src/constants/shot/typesShot.const'
import type { ShootingStatusSMS } from 'src/enums/shot/ShootingStatusSMS.type'
import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import type { IContactSMS } from 'src/types/sms/IContactSMS.type'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { computed, ref, watch } from 'vue'
import ChipSelect from 'src/components/select/ChipSelect.vue'
import { IOption } from 'src/types/IOption.type'
import { ICampaign } from 'src/types/campaign/ICampaign.type'

interface IProps {
  modelValue: {
    id?: string
    date: string
    name: string
    typeShot: TypeShotSMS
    typeSMS: TypeSMS
    typeRoute: TypeRouteSMS
    status: ShootingStatusSMS
    campaignId: string
    contactIds: string[]
  }
  options: {
    campaigns: ICampaign[]
    contactSMS: IContactSMS[]
    typeSMS: IOption<string>[]
  }
}

const props = defineProps<IProps>()

const v = ref(props.modelValue)

const emit = defineEmits(['modelValue:update'])

const currentTypeSMSOptions = computed(() => {
  const { typeShot } = v.value
  return typeSMSOptions.filter((item) => {
    const matchTypeShot =
      typeShot === TypeShotSMS.twoWay ? item.value != TypeSMS.flash : true

    if (matchTypeShot && typeShot === TypeShotSMS.twoWay)
      v.value.typeSMS = TypeSMS.standard

    return matchTypeShot
  })
})

watch(
  () => v.value,
  (v) => emit('modelValue:update', v),
)
</script>
