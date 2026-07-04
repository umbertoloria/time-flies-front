import axios from 'axios'
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
  getAccessToken: () => Promise<string | undefined>
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

export const getSDK = () => {
  return {
    readStreamline: (filters: {
      seeAllCalendars: boolean
    }): Promise<TCalendarSDK.ReadPlannedEventsResponse | 'unable'> =>
      api
        .get(
          `/calendars/streamline${filters.seeAllCalendars ? '?includeArchivedCalendars=true' : ''}`
        )
        .then(({ data }) => data),
  }
}

export const getCalendarSDK = () => ({
  readAllCalendars: (filters: {
    dateFrom: string
    seeAllCalendars: boolean
  }): Promise<TCalendarPrev[]> =>
    api
      .get(
        `/calendars?dateFrom=${filters.dateFrom}${filters.seeAllCalendars ? '&showAll=true' : ''}`
      )
      .then(({ data }) => data),
  readCalendar: (id: number): Promise<TCalendar | 'unable'> =>
    api
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
    api.get(`calendars/${calendarId}/date/${date}`).then(({ data }) => data),
  checkDateWithSuccess: (
    id: number,
    date: string,
    notes: undefined | string
  ): Promise<TNewDoneTask> =>
    api
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
    api
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
    api
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
    api
      .post(`calendars/${calendarId}/todos/${todoId}`, {
        notes: fields.notes === null ? '' : fields.notes || undefined,
        date: fields.date || undefined,
      })
      .then(({ data }) => data),
  setTodoAsDone: (calendarId: number, todoId: number): Promise<TNewDoneTask> =>
    api
      .post(`calendars/${calendarId}/todos/${todoId}/set-as-done`)
      .then(({ data }) => data),
})
