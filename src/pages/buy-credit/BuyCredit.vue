<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Comprar créditos</h1>

    <q-card v-bind="$vCard">
      <q-form @submit="save">
        <q-card-section>
          <q-input
            v-bind="$vInput"
            v-model="state.creditsValue"
            prefix="R$"
            mask="#.###,##"
            reverse-fill-mask
            label="Créditos"
            :rules="[requiredRule]"
            :readonly="!!state.pix.urlPayment"
          />

          <p class="q-mb-xs">Tipo de pagamento:</p>

          <q-btn-toggle
            :disable="!!state.pix.urlPayment"
            v-model="state.paymentType"
            toggle-color="primary"
            :options="
              paymentTypeOptions.map((item) => ({ ...item, label: item.name }))
            "
            class="q-mb-md"
            dense
            spread
          />

          <div class="row q-col-gutter-md" v-if="isActive(PaymentType.credit)">
            <div class="col-12">
              <q-input
                v-bind="$vInput"
                v-model="state.credit.cardNumber"
                unmasked-value
                label="Número do Cartão"
                mask="#### #### #### ####"
                :rules="[(v) => numberLengthRule(v, 16)]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-bind="$vInput"
                v-model="state.credit.fullName"
                label="Nome do Titular"
                :rules="[requiredRule]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-bind="$vInput"
                v-model="state.credit.expirationDate"
                label="Validade (MM/AA)"
                mask="##/##"
                unmasked-value
                :rules="[(v) => numberLengthRule(v, 4)]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-bind="$vInput"
                unmasked-value
                v-model="state.credit.securityCode"
                label="CVV"
                mask="###"
                :rules="[(v) => numberLengthRule(v, 3)]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-bind="$vInput"
                unmasked-value
                v-model="state.credit.cpf"
                label="CPF do titular"
                mask="###.###.###-##"
                :rules="[(v) => numberLengthRule(v, 11)]"
              />
            </div>
          </div>
          <div v-if="isActive(PaymentType.pix)">
            <q-card v-bind="$vCard" class="text-center q-pa-md q-mb-md">
              <div v-if="state.pix.urlPayment">
                <q-img
                  :src="state.pix.urlPayment"
                  fit="contain"
                  height="200px"
                />
              </div>
              <p v-else class="q-mb-none">
                Após o confirmar será gerado um QR code
              </p>
            </q-card>

            <q-input
              v-if="!state.pix.urlPayment"
              v-bind="$vInput"
              unmasked-value
              v-model="state.pix.cpf"
              label="CPF do titular"
              mask="###.###.###-##"
              :rules="[(v) => numberLengthRule(v, 11)]"
            />
          </div>
        </q-card-section>

        <q-card-section align="right">
          <q-btn
            v-if="state.pix.urlPayment"
            outline
            label="Cancelar"
            type="submit"
            @click="clearURLPix"
          />
          <q-btn
            v-if="!state.pix.urlPayment"
            color="primary"
            label="Confirmar"
            type="submit"
          />
        </q-card-section>
      </q-form>

      <q-inner-loading :showing="loaderStatus(loader.save)">
        <q-spinner color="primary" size="50px" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paymentTypeOptions } from 'src/constants/buy-credit/paymentType.const'
import { PaymentType } from 'src/enums/buy-credit/PaymentType.enum'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import requester from 'src/helpers/requester/Requester.helper'
import * as BuyCreditService from 'src/services/buy-credit.service'
import { numberLengthRule } from 'src/validations/form-rules/numberRules.util'
import { useLoader } from 'src/composables/useLoader'

interface IState {
  paymentType: PaymentType
  creditsValue: number
  credit: {
    cardNumber: number
    fullName: string
    expirationDate: string
    securityCode: number
    cpf: string
  }
  pix: {
    cpf: string
    urlPayment: string
  }
}

const state = ref<IState>({
  paymentType: PaymentType.credit,
  creditsValue: 0,
  credit: {
    cardNumber: 0,
    fullName: '',
    expirationDate: '',
    securityCode: 0,
    cpf: '',
  },
  pix: {
    cpf: '',
    urlPayment: '',
  },
})

const loader = {
  save: 'save-d1342g54jh',
}

const { toggleLoading, loaderStatus } = useLoader()

function isActive(paymentType: PaymentType) {
  return state.value.paymentType === paymentType
}

async function save() {
  await requester.dispatch({
    callback: async () => {
      if (state.value.paymentType == PaymentType.credit)
        await BuyCreditService.paymentCredit(
          state.value.creditsValue,
          state.value.credit.cardNumber,
          state.value.credit.fullName,
          state.value.credit.expirationDate,
          state.value.credit.securityCode,
          state.value.credit.cpf,
        )

      if (state.value.paymentType == PaymentType.pix)
        state.value.pix.urlPayment = await BuyCreditService.paymentPix(
          state.value.creditsValue,
          state.value.pix.cpf,
        )
    },
    successCallback: () => {
      resetForms()
      toggleLoading(loader.save)
    },
    successMessageTitle: 'Ação confirmada com sucesso',
    errorMessageTitle: 'Houve um erro',
    errorMessage: 'Não foi possível',
    loaders: [loader.save],
  })
}

function resetForms() {
  state.value.credit = {
    cardNumber: 0,
    fullName: '',
    expirationDate: '',
    securityCode: 0,
    cpf: '',
  }

  state.value.pix.cpf = ''
}

function clearURLPix() {
  state.value.pix.urlPayment = ''
}
</script>
