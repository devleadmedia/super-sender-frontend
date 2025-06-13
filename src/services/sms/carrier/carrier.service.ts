// import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import type { ICarrier } from 'src/types/sms/ICarrier.type'

export async function getAll(): Promise<ICarrier[]> {
  /* const { data } = await httpClientAxios.get('/carrier')
  return data */

  await fakePromise(1000)

  return [
    {
      id: 1,
      name: '1nce',
    },
    {
      id: 2,
      name: 'AEIOU',
    },
    {
      id: 3,
      name: 'Algar',
    },
    {
      id: 4,
      name: 'America Net',
    },
    {
      id: 5,
      name: 'Brisanet',
    },
    {
      id: 6,
      name: 'Cinco Telecom',
    },
    {
      id: 7,
      name: 'Claro',
    },
    {
      id: 8,
      name: 'Cubic Telecom',
    },
    {
      id: 9,
      name: 'Datora',
    },
    {
      id: 10,
      name: 'Ligue',
    },
    {
      id: 11,
      name: 'NLT',
    },
    {
      id: 12,
      name: 'Options',
    },
    {
      id: 13,
      name: 'Sercomtel',
    },
    {
      id: 14,
      name: 'Surf',
    },
    {
      id: 15,
      name: 'Telecall',
    },
    {
      id: 16,
      name: 'Terapar',
    },
    {
      id: 17,
      name: 'TIM',
    },
    {
      id: 18,
      name: 'Unifique',
    },
    {
      id: 19,
      name: 'Vecto Mobile',
    },
    {
      id: 20,
      name: 'Vivo',
    },
  ]
}
