import axios from 'axios'
import { TAuthStatus, TCalendar, TCalendarSDK, TScheduleSDK } from './sdk/types'

const backendURL = import.meta.env.VITE_BACKEND_ENDPOINT

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

function makeFormData(args: Record<string, string | undefined>) {
  const formData = new FormData()
  for (const key in args) {
    const value = args[key]
    if (value !== undefined) {
      formData.set(key, value)
    }
  }
  return formData
}

// Auth
// Calendar
// Exercise
/*.catch<'not-found'>(err => {
  if (err?.response?.status === 404) {
    return 'not-found'
  }
  throw err
})*/

// API SDK
export const getSDK = () => {
  return {
    // Auth
    authStatus: () =>
      api.get('?a=status').then<TAuthStatus>(({ data }) => data),
    /*// Debug only.
      export const authStatus = (): Promise<TAuthStatus> =>
        Promise.resolve({
          user: {
            id: 1,
            email: 'test@test.com',
          },
        })*/
    authLogin: (email: string, password: string) =>
      api
        .post('?a=login', makeFormData({ email, password }))
        .then<'ok'>(() => 'ok')
        .catch(err => {
          if (err.response?.data === 'invalid') {
            return 'invalid'
          }
          throw err
        }),
    authLogout: () =>
      api
        .get('?a=logout')
        .then<'ok'>(() => 'ok')
        .catch(err => {
          if (err.response?.data === 'invalid') {
            return 'invalid'
          }
          throw err
        }),

    // Calendar
    readCalendar: (id: number) =>
      api.get(`?a=calendar-read&id=${id}`).then<TCalendar>(({ data }) => data),
    checkDateWithSuccess: (
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
        }),

    // Schedule
    readDateSchedule: (localDate: string, showAll?: boolean) =>
      api
        .get(
          `?a=schedule-read&local-date=${localDate}${showAll ? '&show-all=true' : ''}`
        )
        /*.catch<'not-found'>(err => {
          if (err?.response?.status === 404) {
            return 'not-found'
          }
          throw err
        })*/
        .then<TScheduleSDK.ReadScheduleAndAllExerciseGroups>(
          ({ data }) => data
        ),
    readDaysWithExerciseRecords: () =>
      api.get('?a=days-with-exercise-records').then<{
        dates: string[]
      }>(({ data }) => data),
    createExerciseRecord: (
      exerciseId: number,
      localDate: string,
      params: {
        bpm: number
        minutes?: number
        hand?: 'dx' | 'sx'
      }
    ) =>
      api
        .post(
          `?a=exercise-record-create`,
          makeFormData({
            'exercise-id': `${exerciseId}`,
            'local-date': localDate,
            bpm: `${params.bpm}`,
            minutes:
              typeof params.minutes == 'number'
                ? `${params.minutes}`
                : undefined,
            hand: params.hand ? `${params.hand}` : undefined,
          })
        )
        .then<'ok'>(() => 'ok')
        .catch(err => {
          if (err.response?.data === 'invalid-bpm') {
            return 'invalid-bpm'
          } else if (err.response?.data === 'invalid-minutes') {
            return 'invalid-minutes'
          }
          throw err
        }),
  }
}
