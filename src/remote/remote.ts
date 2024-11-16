import axios from 'axios'
import { TAuthStatus, TCalendar, TCalendarSDK, TScheduleSDK } from './sdk/types'

const backendURL = import.meta.env.VITE_BACKEND_ENDPOINT

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

export const authStatus = () =>
  api.get('?a=status').then<TAuthStatus>(({ data }) => data)
/*// Debug only.
export const authStatus = (): Promise<TAuthStatus> =>
  Promise.resolve({
    user: {
      id: 1,
      email: 'test@test.com',
    },
  })*/

export const readCalendar = (id: number) =>
  api.get(`?a=calendar-read&id=${id}`).then<TCalendar>(({ data }) => data)

export const checkDateWithSuccess = (
  id: number,
  localDate: string
): Promise<TCalendarSDK.CheckDateWithSuccessPromiseOutput> =>
  api
    .post(
      '?a=calendar-date-create',
      makeFormData({ id: `${id}`, 'local-date': localDate })
    )
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid') {
        return 'invalid'
      }
      throw err
    })

export const authLogin = (email: string, password: string) =>
  api
    .post('?a=login', makeFormData({ email, password }))
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid') {
        return 'invalid'
      }
      throw err
    })

export const authLogout = () =>
  api
    .get('?a=logout')
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid') {
        return 'invalid'
      }
      throw err
    })

function makeFormData(args: Record<string, string>) {
  const formData = new FormData()
  for (const key in args) {
    const value = args[key]
    formData.set(key, value)
  }
  return formData
}

// Exercise
export const readDateSchedule = (localDate: string, showAll?: boolean) =>
  api
    .get(
      `?a=schedule-read&local-date=${localDate}${showAll ? '&show-all=true' : ''}`
    )
    .then<TScheduleSDK.ReadScheduleAndAllExerciseGroups>(({ data }) => data)
/*.catch<'not-found'>(err => {
  if (err?.response?.status === 404) {
    return 'not-found'
  }
  throw err
})*/

export const createExerciseRecord = (
  exerciseId: number,
  localDate: string,
  params: {
    bpm: number
  }
) =>
  api
    .post(
      `?a=exercise-record-create`,
      makeFormData({
        'exercise-id': `${exerciseId}`,
        'local-date': localDate,
        bpm: `${params.bpm}`,
      })
    )
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid-bpm') {
        return 'invalid-bpm'
      }
      throw err
    })
