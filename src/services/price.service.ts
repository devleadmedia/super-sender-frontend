import { api } from 'src/boot/axios'
import type {
  IDataEmail,
  IDataSMS,
  IDataWhatsapp,
  ITablePrice,
  ITablePriceResult,
} from 'src/types/price/ITablePrice.type'
import type { IPrice } from 'src/types/price/IPrice.type'
import { fakePromise } from 'src/utils/fakePromise.util'
import { Status } from 'src/enums/Status.enum'
import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import type { ShippingType } from 'src/enums/ShippingType.enum'

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
            typeRoute: TypeRouteSMS.longCode,
            typeShot: TypeShotSMS.oneWay,
            value: 0.14,
          },
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRouteSMS.shortCode,
            typeShot: TypeShotSMS.oneWay,
            value: 0.21,
          },
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRouteSMS.longCode,
            typeShot: TypeShotSMS.oneWay,
            value: 0.19,
          },
          {
            typeSMS: TypeSMS.flash,
            typeRoute: TypeRouteSMS.shortCode,
            typeShot: TypeShotSMS.oneWay,
            value: 0.15,
          },
        ],
      },
      {
        name: 'Flash SMS',
        data: [
          {
            typeRoute: TypeRouteSMS.longCode,
            typeShot: TypeShotSMS.oneWay,
            typeSMS: TypeSMS.standard,
            value: 0.04,
          },
          {
            typeRoute: TypeRouteSMS.shortCode,
            typeShot: TypeShotSMS.oneWay,
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
      status: Status.active,
      client: {
        id: '1',
        name: 'Joel',
      },
      tablePriceSMS: [
        {
          name: 'SMS',
          data: [
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRouteSMS.longCode,
              typeShot: TypeShotSMS.oneWay,
              value: 0.14,
            },
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRouteSMS.shortCode,
              typeShot: TypeShotSMS.oneWay,
              value: 0.21,
            },
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRouteSMS.longCode,
              typeShot: TypeShotSMS.oneWay,
              value: 0.19,
            },
            {
              typeSMS: TypeSMS.flash,
              typeRoute: TypeRouteSMS.shortCode,
              typeShot: TypeShotSMS.oneWay,
              value: 0.15,
            },
          ],
        },
      ],
      tablePriceEmail: [],
      tablePriceWhatsapp: [],
    },
    {
      id: '2',
      status: Status.active,
      client: {
        id: '2',
        name: 'Abel',
      },
      tablePriceSMS: [],
      tablePriceEmail: [],
      tablePriceWhatsapp: [],
    },
    {
      id: '3',
      status: Status.inactive,
      client: {
        id: '3',
        name: 'Carlos',
      },
      tablePriceSMS: [],
      tablePriceWhatsapp: [],
      tablePriceEmail: [],
    },
  ]
}

export async function create(
  shippingTypeStep: ShippingType,
  shippingType: ShippingType[],
  clientId: string,
  status: Status,
  tablePriceSMS: ITablePrice<IDataSMS>[],
  tablePriceEmail: ITablePrice<IDataEmail>[],
  tablePriceWhatsapp: ITablePrice<IDataWhatsapp>[],
) {
  await api.post('/price', {
    shippingTypeStep,
    shippingType,
    clientId,
    status,
    tablePriceSMS,
    tablePriceEmail,
    tablePriceWhatsapp,
  })
}

export async function save(
  id: string,
  shippingTypeStep: ShippingType,
  shippingType: ShippingType[],
  clientId: string,
  status: Status,
  tablePriceSMS: ITablePrice<IDataSMS>[],
  tablePriceEmail: ITablePrice<IDataEmail>[],
  tablePriceWhatsapp: ITablePrice<IDataWhatsapp>[],
) {
  await api.put(`/price/${id}`, {
    shippingTypeStep,
    shippingType,
    clientId,
    status,
    tablePriceSMS,
    tablePriceEmail,
    tablePriceWhatsapp,
  })
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
