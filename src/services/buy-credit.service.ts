import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function paymentCredit(
  creditsValue: number,
  cardNumber: number,
  fullName: string,
  expirationDate: string,
  securityCode: number,
  cpf: string,
) {
  await fakePromise(1000)

  await httpClientAxios.post('/buyCredit/credit', {
    creditsValue,
    cardNumber,
    fullName,
    expirationDate,
    securityCode,
    cpf,
  })
}

export async function paymentPix(
  creditsValue: number,
  cpf: string,
): Promise<string> {
  await fakePromise(1000)

  /* await httpClientAxios.post('/buyCredit/pix', {
    creditsValue,
    cpf,
  }) */

  console.log(creditsValue, cpf)

  return 'https://httpClientAxios.qrserver.com/v1/create-qr-code/?size=200x200&data=pagamento-pix'
}
