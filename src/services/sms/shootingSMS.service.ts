import { httpClientAxios } from 'src/boot/axios'
import { fakePromise } from 'src/utils/fakePromise.util'
import { random } from 'lodash'
import type { IShootingSMS } from 'src/types/sms/IShootingSMS.type'
import { shootingStatusSMSOptions } from 'src/constants/shot/shootingStatusSMS.const'
import {
  TypeRouteSMS,
  TypeShotSMS,
  TypeSMS,
} from 'src/enums/shot/TypesSMS.enum'
import type { ShootingStatusSMS } from 'src/enums/shot/ShootingStatusSMS.type'
import { Status } from 'src/enums/Status.enum'
import { IPaginationResult } from 'src/types/pagination/IPaginationResult.type'

export async function confirmShooting() {
  await httpClientAxios.post('/shooting/sms/confirm')
}

export async function getAll(
  page: number,
  rowsPerPage: number,
  sortBy: string,
  descending: boolean,
  search: string,
  startDate: string,
  endDate: string,
  typeShot?: TypeShotSMS,
  typeSMS?: TypeSMS,
  typeRoute?: TypeRouteSMS,
  status?: ShootingStatusSMS,
  user?: string,
): Promise<IPaginationResult<IShootingSMS>> {
  /* const { data } = await httpClientAxios.get('/shooting/sms', {
    data: {
      search,
      startDate,
      endDate,
      typeShot,
      typeSMS,
      typeRoute,
      status,
      user,
    }
  })
  return data */

  await fakePromise(1000)

  const data: IShootingSMS[] = []

  for (let idx = 0; idx < 20; idx++) {
    const date = new Date()
    date.setDate(date.getDate() + idx)

    data.push({
      id: `${idx}`,
      name: `Titulo de disparo #${idx}`,
      status: shootingStatusSMSOptions[random(0, 5, false)]!.value,
      contactIds: ['0', '1', '2'],
      date: date.toISOString(),
      campaign: {
        id: '0',
        menssageIds: ['0', '1', '2'],
        name: '0# Nome da campanha',
        status: Status.active,
      },
      typeRoute: random(0, 1, false)
        ? TypeRouteSMS.longCode
        : TypeRouteSMS.shortCode,
      typeShot: random(0, 1, false) ? TypeShotSMS.oneWay : TypeShotSMS.twoWay,
      typeSMS: random(0, 1, false) ? TypeSMS.flash : TypeSMS.standard,
      user: {
        id: `${idx}`,
        name: `Nome ${idx}`,
      },
    })
  }

  console.log(
    page,
    rowsPerPage,
    sortBy,
    descending,
    search,
    startDate,
    endDate,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    user,
  )

  return {
    data,
    page,
    rowsPerPage,
    totalRows: 122,
  }
}

export async function create(
  date: string,
  name: string,
  typeShot: TypeShotSMS,
  typeSMS: TypeSMS,
  typeRoute: TypeRouteSMS,
  status: ShootingStatusSMS,
  campaignId: string,
  contactIds: string[],
): Promise<number | null> {
  /* await httpClientAxios.post('/shooting/sms', {
    date,
    name,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    campaignIds,
    contactId,
  }) */

  await fakePromise(1000)

  console.log(
    date,
    name,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    campaignId,
    contactIds,
  )

  return 32.24
}

export async function save(
  id: string,
  date: string,
  name: string,
  typeShot: TypeShotSMS,
  typeSMS: TypeSMS,
  typeRoute: TypeRouteSMS,
  status: ShootingStatusSMS,
  campaignId: string,
  contactIds: string[],
): Promise<number | null> {
  /* await httpClientAxios.put(`/shooting/sms/${id}`, {
    date,
    name,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    campaignIds,
    contactId,
  }) */

  await fakePromise(1000)

  console.log(
    id,
    date,
    name,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    campaignId,
    contactIds,
  )

  return null
}

export async function deleteItem(ids: string[]) {
  await httpClientAxios.delete(`/shooting/sms/`, {
    data: { ids },
  })
}

export async function pause(ids: string[]) {
  await httpClientAxios.patch('/shooting/sms/pause', {
    ids,
  })
}

export async function play(ids: string[]) {
  await httpClientAxios.patch('/shooting/sms/pause', {
    ids,
  })
}

export async function cancel(ids: string[]) {
  await httpClientAxios.patch('/shooting/sms/pause', {
    ids,
  })
}
