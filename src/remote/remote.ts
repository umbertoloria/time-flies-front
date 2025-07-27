import axios from 'axios'
import { TAuthStatus, TCalendar, TCalendarSDK, TScheduleSDK } from './sdk/types'
import { getTodayLocalDate } from '../lib/utils.ts'

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

// Debug only.
// const debugMode = true as const
const debugMode = false as const
export const getSDK = () => {
  return {
    // Auth
    authStatus: (): Promise<TAuthStatus> =>
      debugMode
        ? Promise.resolve({
            user: {
              id: 1,
              email: 'test@test.com',
            },
          })
        : api.get('?a=status').then(({ data }) => data),
    authLogin: (email: string, password: string): Promise<'ok' | 'invalid'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post('?a=login', makeFormData({ email, password }))
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),
    authLogout: (): Promise<'ok' | 'invalid'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .get('?a=logout')
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),

    // Calendar
    readAllCalendars: (filters: {
      dateFrom: string
    }): Promise<{ calendars: TCalendar[] }> =>
      debugMode
        ? Promise.resolve({
            calendars: [
              {
                id: 1,
                name: 'Debug calendar 1',
                color: '#f77',
                plannedColor: '#fee',
                usesNotes: true,
                days: [
                  {
                    date: getTodayLocalDate(),
                    notes: 'Debug notes',
                  },
                ],
                plannedDays: [],
              },
              {
                id: 2,
                name: 'Debug calendar 2',
                color: '#77f',
                plannedColor: '#eef',
                usesNotes: true,
                days: [
                  {
                    date: getTodayLocalDate(),
                    notes: 'Debug notes',
                  },
                ],
                plannedDays: [],
              },
            ],
          })
        : api
            .get(
              // When "date-from" filter is optional:
              //   `?a=calendars-read${typeof filters.dateFrom === 'string' ? `&date-from=${filters.dateFrom}` : ''}`
              `?a=calendars-read&date-from=${filters.dateFrom}`
            )
            .then(({ data }) => data),
    readCalendar: (id: number): Promise<TCalendar | 'unable'> =>
      debugMode
        ? (() => {
            if (id === 1) {
              return Promise.resolve<TCalendar>({
                id: 1,
                name: 'Debug calendar 1',
                color: '#f77',
                plannedColor: '#fee',
                usesNotes: true,
                days: [
                  {
                    date: getTodayLocalDate(),
                    notes: 'Debug notes',
                  },
                ],
                plannedDays: [],
              })
            } else if (id === 2) {
              return Promise.resolve<TCalendar>({
                id: 2,
                name: 'Debug calendar 2',
                color: '#77f',
                plannedColor: '#eef',
                usesNotes: true,
                days: [
                  {
                    date: getTodayLocalDate(),
                    notes: 'Debug notes',
                  },
                ],
                plannedDays: [],
              })
            }
            return Promise.reject(new Error('Calendar not found (debug mode)'))
          })()
        : api
            .get(`?a=calendar-read&cid=${id}`)
            .then(({ data }) => data)
            .catch(() => {
              return 'unable'
            }),
    readCalendarDate: (
      calendarId: number,
      date: string
    ): Promise<TCalendarSDK.ReadDateResponse> =>
      debugMode
        ? (() => {
            if (calendarId === 1) {
              return Promise.resolve<TCalendarSDK.ReadDateResponse>({
                date: getTodayLocalDate(),
                calendar: {
                  id: 1,
                  name: 'Debug calendar 1',
                  color: '#f77',
                  plannedColor: '#fee',
                  usesNotes: true,
                },
                doneTasks: [
                  {
                    id: 1,
                    // date: getTodayLocalDate(),
                    notes: 'Debug notes',
                  },
                ],
                todos: [
                  {
                    id: 1,
                    // date: getTodayLocalDate(),
                    notes: 'Debug planned notes',
                  },
                ],
              })
            }
            return Promise.reject(new Error('Calendar not found (debug mode)'))
          })()
        : api
            .get(`?a=calendar-date-read&cid=${calendarId}&date=${date}`)
            .then(({ data }) => data),
    checkDateWithSuccess: (
      id: number,
      localDate: string,
      notes: undefined | string
    ): Promise<'ok' | 'invalid'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post(
              '?a=calendar-date-create',
              makeFormData({
                id: `${id}`,
                'local-date': localDate,
                notes,
              })
            )
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),
    updateCalendarDateNotes: (
      calendarId: number,
      localDate: string,
      notes: undefined | string
    ): Promise<'ok' | 'invalid'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post(
              '?a=calendar-date-update-notes',
              makeFormData({
                'calendar-id': `${calendarId}`,
                'local-date': localDate,
                notes,
              })
            )
            .then<'ok'>(() => 'ok'),
    updatePlannedEventNotes: (
      calendarId: number,
      eventId: number,
      notes?: string
    ) =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post(
              '?a=planned-event-update-notes',
              makeFormData({
                cid: `${calendarId}`,
                eid: `${eventId}`,
                notes,
              })
            )
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),
    movePlannedEvent: (calendarId: number, eventId: number, newDate: string) =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post(
              '?a=planned-event-move',
              makeFormData({
                cid: `${calendarId}`,
                eid: `${eventId}`,
                date: newDate,
              })
            )
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),
    setDateAsPlannedEvent: (
      id: number,
      localDate: string,
      notes: undefined | string
    ) =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post(
              '?a=planned-event-create',
              makeFormData({
                id: `${id}`,
                'local-date': localDate,
                notes,
              })
            )
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),

    // Schedule
    readDateSchedule: (
      localDate: string,
      showAll?: boolean
    ): Promise<TScheduleSDK.ReadScheduleAndAllExerciseGroups> =>
      debugMode
        ? Promise.resolve({
            schedule: {
              groups: [
                {
                  id: 1,
                  name: 'Debug exercise group 1',
                  exercises: [
                    {
                      id: 1,
                      name: 'Debug exercise 1',
                      records: [
                        {
                          id: 1,
                          bpm: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            allExerciseGroups: [
              {
                id: 2,
                name: 'Debug exercise group 2',
                exercises: [
                  {
                    id: 2,
                    name: 'Debug exercise 2',
                  },
                ],
              },
            ],
          })
        : api
            .get(
              `?a=schedule-read&local-date=${localDate}${showAll ? '&show-all=true' : ''}`
            )
            /*.catch<'not-found'>(err => {
if (err?.response?.status === 404) {
return 'not-found'
}
throw err
})*/
            .then(({ data }) => data),
    readDaysWithExerciseRecords: (): Promise<{
      dates: string[]
    }> =>
      debugMode
        ? Promise.resolve({
            dates: [getTodayLocalDate()],
          })
        : api.get('?a=days-with-exercise-records').then(({ data }) => data),
    createExerciseRecord: (
      exerciseId: number,
      localDate: string,
      params: {
        bpm: number
        minutes?: number
        hand?: 'dx' | 'sx'
      }
    ): Promise<'ok' | 'invalid-bpm' | 'invalid-minutes'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
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
            .catch<'invalid-bpm' | 'invalid-minutes'>(err => {
              if (err.response?.data === 'invalid-bpm') {
                return 'invalid-bpm'
              } else if (err.response?.data === 'invalid-minutes') {
                return 'invalid-minutes'
              }
              throw err
            }),
    readStreamline: (): Promise<
      TCalendarSDK.ReadPlannedEventsResponse | 'unable'
    > =>
      debugMode
        ? Promise.resolve<TCalendarSDK.ReadPlannedEventsResponse>({
            dates: [
              {
                date: getTodayLocalDate(),
                calendars: [
                  {
                    id: 1,
                    name: 'Debug calendar 1',
                    color: '#f77',
                    plannedColor: '#fee',
                    usesNotes: true,
                    todos: [
                      {
                        id: 1,
                        notes: 'Debug notes',
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: 'Debug calendar 2',
                    color: '#77f',
                    plannedColor: '#eef',
                    usesNotes: true,
                    todos: [
                      {
                        id: 2,
                        notes: 'Debug notes',
                      },
                    ],
                  },
                ],
              },
            ],
          })
        : api
            .get('?a=planned-event-read')
            .then(({ data }) => data)
            .catch<'unable'>(() => 'unable'),
    checkPlannedEventWithSuccess: (
      calendarId: number,
      eventId: number,
      mode:
        | {
            type: 'done'
            notes: undefined | string
          }
        | {
            type: 'missed'
          }
    ): Promise<'ok' | 'invalid'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post(
              '?a=planned-event-set-as-done',
              makeFormData({
                calendar_id: `${calendarId}`,
                event_id: `${eventId}`,
                set_as_missed: mode.type === 'missed' ? 'true' : undefined,
                notes:
                  mode.type === 'done' && typeof mode.notes === 'string'
                    ? mode.notes
                    : undefined,
              })
            )
            .then<'ok'>(() => 'ok')
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),
  }
}
