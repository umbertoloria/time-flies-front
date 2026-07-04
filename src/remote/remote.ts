import axios from 'axios'
import { Optional } from '@silverhand/essentials'
import { getTodayLocalDate } from '@/lib/utils'
import {
  TCalendar,
  TCalendarPrev,
  TCalendarSDK,
  TNewDoneTask,
  TNewTodo,
} from '@/remote/sdk/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT!,
  withCredentials: true,
})

export const setupAxiosInterceptors = (
  getAccessToken: () => Promise<Optional<string>>
) => {
  api.interceptors.request.use(
    async config => {
      try {
        const token = await getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Unable to retrieve Token for Axios', error)
      }
      return config
    },
    error => Promise.reject(error)
  )
}

// Debug only.
// const debugMode = true as const
const debugMode = false as const
export const getSDK = () => {
  return {
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
        : api.get('/calendars/streamline').then(({ data }) => data),
  }
}

export const getCalendarSDK = () => ({
  readAllCalendars: (filters: {
    dateFrom: string
    seeAllCalendars: boolean
  }): Promise<TCalendarPrev[]> =>
    debugMode
      ? Promise.resolve([
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
        ])
      : api
          .get(
            `/calendars?dateFrom=${filters.dateFrom}${filters.seeAllCalendars ? '&showAll=true' : ''}`
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
          .get(`/calendars/${id}`)
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
      .post('/calendars', {
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
  ) =>
    api
      .post(`/calendars/${calendarId}`, {
        name: data.name || undefined,
        color: data.color || undefined,
        plannedColor: data.plannedColor || undefined,
        usesNotes:
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
          .get(`calendars/${calendarId}/date/${date}`)
          .then(({ data }) => data),
  checkDateWithSuccess: (
    id: number,
    date: string,
    notes: undefined | string
  ): Promise<TNewDoneTask> =>
    debugMode
      ? Promise.resolve({
          id: 1,
          // date: getTodayLocalDate(),
          notes: 'Debug notes',
        })
      : api
          .post(`calendars/${id}/tasks/done`, {
            date,
            notes,
          })
          .then(({ data }) => data)
          .catch<'invalid'>(err => {
            if (err.response?.data === 'invalid') {
              return 'invalid'
            }
            throw err
          }),
  updateTask: (
    calendarId: number,
    taskId: number,
    fields: {
      date?: string
      notes?: string | null
    }
  ): Promise<TNewDoneTask> =>
    debugMode
      ? Promise.resolve({
          id: 1,
          // date: getTodayLocalDate(),
          notes: 'Debug notes',
        })
      : api
          .post(`calendars/${calendarId}/tasks/${taskId}`, {
            date: fields.date || undefined,
            notes: fields.notes === null ? '' : fields.notes || undefined,
          })
          .then(({ data }) => data),
})
export const getPlannedEventSDK = () => ({
  setDateAsPlannedEvent: (
    id: number,
    localDate: string,
    notes: undefined | string
  ): Promise<TNewTodo> =>
    debugMode
      ? Promise.resolve({
          id: 1,
          // date: getTodayLocalDate(),
          notes: 'Debug notes',
        })
      : api
          .post(`calendars/${id}/todos`, {
            date: localDate,
            notes,
          })
          .then(({ data }) => data)
          .catch<'invalid'>(err => {
            if (err.response?.data === 'invalid') {
              return 'invalid'
            }
            throw err
          }),
  updateTodo: (
    calendarId: number,
    todoId: number,
    fields: {
      notes?: string | null
      date?: string
    }
  ) =>
    debugMode
      ? Promise.resolve('ok')
      : api
          .post(`calendars/${calendarId}/todos/${todoId}`, {
            notes: fields.notes === null ? '' : fields.notes || undefined,
            date: fields.date || undefined,
          })
          .then(({ data }) => data),
  setTodoAsDone: (calendarId: number, todoId: number): Promise<TNewDoneTask> =>
    debugMode
      ? Promise.resolve({
          id: 1,
          // date: getTodayLocalDate(),
          notes: 'Debug notes',
        })
      : api
          .post(`calendars/${calendarId}/todos/${todoId}/set-as-done`)
          .then(({ data }) => data),
})
