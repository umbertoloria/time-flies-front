import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getSDK } from './remote'

const sdk = getSDK()

// QUERIES
export const useReadStreamline = (seeAllCalendars: boolean) => {
  const filters = { seeAllCalendars }
  return useQuery({
    queryKey: ['calendars', 'streamline', filters],
    queryFn: () => sdk.readStreamline(filters),
  })
}

export const useReadAllCalendars = (filters: {
  dateFrom: string
  seeAllCalendars: boolean
}) => {
  return useQuery({
    queryKey: ['calendars', 'list', filters],
    queryFn: () => sdk.readAllCalendars(filters),
    refetchInterval: 10 * 60 * 60 * 1000, // 10 minutes.
    placeholderData: keepPreviousData,
  })
}

export const useReadCalendar = (id: number) => {
  return useQuery({
    queryKey: ['calendars', 'get', id],
    queryFn: () => sdk.readCalendar(id),
    refetchInterval: 3 * 60 * 60 * 1000, // 3 minutes.
  })
}

export const useReadCalendarDate = (calendarId: number, date: string) => {
  return useQuery({
    queryKey: ['calendars', 'get', calendarId, 'date', date],
    queryFn: () => sdk.readCalendarDate(calendarId, date),
    refetchInterval: 3 * 60 * 60 * 1000, // 3 minutes.
  })
}

// MUTATIONS
export const useCreateCalendar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sdk.createCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars', 'list'] }).then()
      queryClient
        .invalidateQueries({ queryKey: ['calendars', 'streamline'] })
        .then()
    },
  })
}

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Parameters<typeof sdk.updateCalendar>[1]
    }) => sdk.updateCalendar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] }).then()
    },
  })
}

export const useCreateDoneTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      date,
      notes,
    }: {
      id: number
      date: string
      notes: string | undefined
    }) => sdk.createDoneTask(id, date, notes),
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({
          queryKey: ['calendars', 'get', variables.id],
        })
        .then()
      queryClient
        .invalidateQueries({
          queryKey: ['calendars', 'list'],
        })
        .then()
      queryClient
        .invalidateQueries({ queryKey: ['calendars', 'streamline'] })
        .then()
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      calendarId,
      taskId,
      fields,
    }: {
      calendarId: number
      taskId: number
      fields: Parameters<typeof sdk.updateTask>[2]
    }) => sdk.updateTask(calendarId, taskId, fields),
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({
          queryKey: ['calendars', 'get', variables.calendarId],
        })
        .then()
      queryClient
        .invalidateQueries({ queryKey: ['calendars', 'streamline'] })
        .then()
    },
  })
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      calendarId,
      localDate,
      notes,
    }: {
      calendarId: number
      localDate: string
      notes: string | undefined
    }) => sdk.createTodo(calendarId, localDate, notes),
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({
          queryKey: ['calendars', 'get', variables.calendarId],
        })
        .then()
      queryClient
        .invalidateQueries({ queryKey: ['calendars', 'streamline'] })
        .then()
    },
  })
}

export const useUpdateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      calendarId,
      todoId,
      fields,
    }: {
      calendarId: number
      todoId: number
      fields: Parameters<typeof sdk.updateTodo>[2]
    }) => sdk.updateTodo(calendarId, todoId, fields),
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({
          queryKey: ['calendars', 'get', variables.calendarId],
        })
        .then()
      queryClient
        .invalidateQueries({ queryKey: ['calendars', 'streamline'] })
        .then()
    },
  })
}

export const useSetTodoAsDone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      calendarId,
      todoId,
    }: {
      calendarId: number
      todoId: number
    }) => sdk.setTodoAsDone(calendarId, todoId),
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({
          queryKey: ['calendars', 'get', variables.calendarId],
        })
        .then()
      queryClient
        .invalidateQueries({ queryKey: ['calendars', 'streamline'] })
        .then()
    },
  })
}
