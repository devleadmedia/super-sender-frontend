// import { httpClientAxios } from 'src/boot/axios'
import { random } from 'lodash'
import { shippingTypeOptions } from 'src/constants/shippingType.const'
import type { IStatement } from 'src/types/statement/IStatement.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(userId?: number): Promise<IStatement[]> {
  /*
    - UTILIZE O TOKEN PARA OBTER O ID DO USUARIO
    - DEVE RECEBER UM PARAMETRO DE USERID, CASO RECEBA DEVE TRAZER O EXTRATO DO USUARIO

    const { data } = await httpClientAxios.get('/statement', {
      paramas: userId
    })
    return data.users
   */

  console.log(userId)

  const data = [] as IStatement[]

  for (let idx = 1; idx < 100; idx++) {
    const date = new Date()
    date.setDate(date.getDate() + idx)
    const v = random(-100, 100, true) || 1
    data.push({
      id: `${idx}`,
      date: date.toISOString(),
      description: `${v > 0 ? 'Comprou' : 'Gastou'} creditos ${v < 0 ? 'na campanha X' : ''}`,
      value: v,
      type: v > 0 ? null : shippingTypeOptions[random(0, 2, false)]!.value,
    })
  }

  await fakePromise(1000)

  return data
}
