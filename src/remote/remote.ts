import axios from 'axios'
import { getTodayLocalDate } from '@/lib/utils'
import { getAuthData } from '@/remote/auth'
import {
  TAuthStatus,
  TCalendar,
  TCalendarPrev,
  TCalendarSDK,
} from '@/remote/sdk/types'

const api = axios.create({
  baseURL: process.env.API_ENDPOINT,
  withCredentials: true,
})

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
        : (() => {
            const authData = getAuthData()
            if (!authData.em || !authData.sp) {
              return Promise.reject(new Error('Guest user'))
            }
            return api.post('/auth/status', authData).then(({ data }) => data)
          })(),
    authLogin: (email: string, password: string): Promise<'ok' | 'invalid'> =>
      debugMode
        ? Promise.resolve('ok')
        : api
            .post('/auth/login', { email, password })
            .then(({ data }) => (data === 'ok-login' ? 'ok' : 'invalid'))
            .catch<'invalid'>(err => {
              if (err.response?.data === 'invalid') {
                return 'invalid'
              }
              throw err
            }),

    /*
    // TODx: Deprecate these Schedule logics
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
            /!*.catch<'not-found'>(err => {
              if (err?.response?.status === 404) {
                return 'not-found'
              }
              throw err
              })*!/
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
    */
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
        : new Promise((resolve, reject) => {
            setTimeout(() => {
              // FIXME: Delaying Streamline retrieval due to DB slowness
              try {
                /*return resolve({
                  dates: [],
                })*/
                return resolve(
                  api
                    .post('/calendars/streamline', {
                      ...getAuthData(),
                    })
                    .then(({ data }) => data)
                    .catch<'unable'>(() => 'unable')
                )
              } catch (e) {
                reject(e)
              }
            }, 1500)
          }),
  }
}

export const getCalendarSDK = () => ({
  readAllCalendars: (filters: {
    dateFrom: string
    seeAllCalendars: boolean
  }): Promise<{ calendars: TCalendarPrev[] }> =>
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
          .post('/calendars', {
            ...getAuthData(),
            'date-from': filters.dateFrom, // This is actually optional.
            'show-all': filters.seeAllCalendars ? 'true' : undefined,
          })
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
          .post(`/calendars/${id}`, {
            ...getAuthData(),
          })
          .then(({ data }) => data)
          .catch(() => {
            return 'unable'
          }),
  createCalendar: (data: {
    name: string
    color: string // Es. "#115599"
    plannedColor: string // Es. "#115599"
    usesNotes: boolean
  }) =>
    api
      .post('/calendars/create', {
        ...getAuthData(),
        name: data.name,
        color: data.color,
        'planned-color': data.plannedColor,
        'uses-notes': data.usesNotes ? 'true' : 'false',
      })
      .then(({ data }) => data),
  updateCalendar: (
    calendarId: number,
    data: {
      name?: string
      color?: string // Es. "#115599"
      plannedColor?: string // Es. "#115599"
      usesNotes?: boolean
    }
  ): Promise<'calendar-uses-notes-cannot-be-disabled' | 'ok-updated'> =>
    api
      .post('/calendars/update', {
        ...getAuthData(),
        cid: `${calendarId}`,
        name: data.name || undefined,
        color: data.color || undefined,
        'planned-color': data.plannedColor || undefined,
        'uses-notes':
          typeof data.usesNotes === 'boolean'
            ? data.usesNotes
              ? 'true'
              : 'false'
            : undefined,
      })
      .then(({ data }) => data),
})
export const getCalendarDateSDK = () => ({
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
          .post(`calendars/${calendarId}/date/${date}`, { ...getAuthData() })
          .then(({ data }) => data),
  checkDateWithSuccess: (
    id: number,
    date: string,
    notes: undefined | string
  ): Promise<'ok' | 'invalid'> =>
    debugMode
      ? Promise.resolve('ok')
      : api
          .post(`calendars/${id}/date-create`, {
            ...getAuthData(),
            date,
            notes,
          })
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
          .post(`calendars/${calendarId}/date-upd-notes/${localDate}`, {
            ...getAuthData(),
            notes,
          })
          .then<'ok'>(() => 'ok'),
})
export const getPlannedEventSDK = () => ({
  setDateAsPlannedEvent: (
    id: number,
    localDate: string,
    notes: undefined | string
  ) =>
    debugMode
      ? Promise.resolve('ok')
      : api
          .post(`calendars/${id}/todo-create/${localDate}`, {
            ...getAuthData(),
            notes,
          })
          .then<'ok'>(() => 'ok')
          .catch<'invalid'>(err => {
            if (err.response?.data === 'invalid') {
              return 'invalid'
            }
            throw err
          }),
  updatePlannedEventNotes: (
    calendarId: number,
    eventId: number,
    notes?: string
  ) =>
    debugMode
      ? Promise.resolve('ok')
      : api
          .post(`calendars/${calendarId}/todo-upd/${eventId}`, {
            ...getAuthData(),
            notes,
          })
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
          .post(`calendars/${calendarId}/todo-move/${eventId}`, {
            ...getAuthData(),
            date: newDate,
          })
          .then<'ok'>(() => 'ok')
          .catch<'invalid'>(err => {
            if (err.response?.data === 'invalid') {
              return 'invalid'
            }
            throw err
          }),
  setEventAsDone: (
    calendarId: number,
    eventId: number,
    notes: undefined | string
  ): Promise<'ok' | 'invalid'> =>
    debugMode
      ? Promise.resolve('ok')
      : api
          .post(`calendars/${calendarId}/todo-done/${eventId}`, {
            ...getAuthData(),
            notes: typeof notes === 'string' ? notes : undefined,
          })
          .then<'ok'>(() => 'ok')
          .catch<'invalid'>(err => {
            if (err.response?.data === 'invalid') {
              return 'invalid'
            }
            throw err
          }),
})
