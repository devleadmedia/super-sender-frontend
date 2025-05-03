import { api } from 'src/boot/axios'
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
  await api.post('/shooting/sms/confirm')
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
  /* const { data } = await api.get('/shooting/sms', {
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
      message: {
        id: '0',
        alternativeMessages: [],
        title: 'Titulo de mensagem',
        message: 'Mensagem de alguma coisa',
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
  messageId: string,
  contactIds: string[],
) {
  /* await api.post('/shooting/sms', {
    date,
    name,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    messageIds,
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
    messageId,
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
  messageId: string,
  contactIds: string[],
) {
  /* await api.put(`/shooting/sms/${id}`, {
    date,
    name,
    typeShot,
    typeSMS,
    typeRoute,
    status,
    messageIds,
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
    messageId,
    contactIds,
  )

  return null
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/shooting/sms/`, {
    data: { ids },
  })
}

export async function pause(ids: string[]) {
  await api.patch('/shooting/sms/pause', {
    ids,
  })
}

export async function play(ids: string[]) {
  await api.patch('/shooting/sms/pause', {
    ids,
  })
}

export async function cancel(ids: string[]) {
  await api.patch('/shooting/sms/pause', {
    ids,
  })
}
