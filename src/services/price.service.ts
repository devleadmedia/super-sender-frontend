import { api } from 'src/boot/axios'
import type { ITablePriceResult } from 'src/types/price/ITablePrice.type'
import type { IPrice } from 'src/types/price/IPrice.type'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import { TypeRoute, TypeShot, TypeSMS } from 'src/enums/shot/sms/TypesSMS.enum'

export async function getTablePrice(): Promise<ITablePriceResult> {
  /* DEVE PESQUISAR USUARIO PELO TOKEN */
  /* const { data } = await api.get('/price/table')
  return data */

  await fakePromise(1000)
  return {
    tableSMS: [
      {
        name: 'SMS',
        data: [
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRoute.longCode,
            typeShot: TypeShot.oneWay,
            value: 0.14,
          },
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRoute.shortCode,
            typeShot: TypeShot.oneWay,
            value: 0.21,
          },
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRoute.longCode,
            typeShot: TypeShot.oneWay,
            value: 0.19,
          },
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRoute.shortCode,
            typeShot: TypeShot.oneWay,
            value: 0.15,
          },
        ],
      },
      {
        name: 'Flash SMS',
        data: [
          {
            typeRoute: TypeRoute.longCode,
            typeShot: TypeShot.oneWay,
            typeSMS: TypeSMS.standard,
            value: 0.04,
          },
          {
            typeRoute: TypeRoute.shortCode,
            typeShot: TypeShot.oneWay,
            typeSMS: TypeSMS.standard,
            value: 0.1,
          },
        ],
      },
    ],
    tableEmail: [],
    tableWhatsapp: [],
  }
}

export async function getAll(): Promise<IPrice[]> {
  /* const { data } = await api.get('/price')
  return data */
  await fakePromise(1000)
  return [
    {
      id: '1',
      name: 'Nome 1',
      status: Status.active,
      client: {
        id: '1',
        name: 'Joel',
      },
      tablePrice: [
        {
          name: 'SMS',
          data: [
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRoute.longCode,
              typeShot: TypeShot.oneWay,
              value: 0.14,
            },
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRoute.shortCode,
              typeShot: TypeShot.oneWay,
              value: 0.21,
            },
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRoute.longCode,
              typeShot: TypeShot.oneWay,
              value: 0.19,
            },
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRoute.shortCode,
              typeShot: TypeShot.oneWay,
              value: 0.15,
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Nome 2',
      status: Status.active,
      client: {
        id: '1',
        name: 'Abel',
      },
      tablePrice: [],
    },
    {
      id: '3',
      name: 'Nome 3',
      status: Status.inactive,
      client: {
        id: '1',
        name: 'Carlos',
      },
      tablePrice: [],
    },
  ]
}

export async function create() {
  await api.post('/price', {})
}

export async function save(id: string) {
  await api.put(`/price/${id}`, {})
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/price/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/price/disable', {
    ids,
  })
}
