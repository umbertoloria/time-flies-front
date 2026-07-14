import { useState } from 'react'
import { fireEventCalendarUpdated } from '@/components/calendar/event-calendar-updated'
import { fireEventStreamlineUpdated } from '@/components/streamline/event-streamline-updated'
import { useUXContext } from '@/context/UXContext'
import {
  useSetTodoAsDone,
  useUpdateTask,
  useUpdateTodo,
} from '@/remote/useCalendarQueries'
import { TCalendarRcd, TNewTodo } from '@/remote/sdk/types'

type DialogForCheckPlannedEventsMode =
  | 'done'
  | 'move'
  | 'move-done-task'
  | 'update-notes'
  | 'update-done-task-notes'

type ContextPartData = {
  calendar: TCalendarRcd
  todo: TNewTodo
  date?: string
  mode: DialogForCheckPlannedEventsMode
  loading: boolean
}
export type ContextDialogForCheckPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (
    calendar: TCalendarRcd,
    todo: TNewTodo,
    mode: DialogForCheckPlannedEventsMode,
    date?: string
  ) => void
  closeDialog: () => void
  confirmProgressDone: (param: undefined | string) => void
}
export const contextDialogForCheckPlannedEventDataDefault: ContextDialogForCheckPlannedEvent =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  } as const

export const useContextDialogForCheckPlannedEventForUX = (): {
  dialogForCheckPlannedEvent: ContextDialogForCheckPlannedEvent
} => {
  const setTodoAsDoneMutation = useSetTodoAsDone()
  const updateTaskMutation = useUpdateTask()
  const updateTodoMutation = useUpdateTodo()

  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })

  return {
    dialogForCheckPlannedEvent: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(calendar, todo, mode, date) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            calendar,
            todo,
            date,
            mode,
            loading: false,
          },
        })
      },
      closeDialog() {
        if (!dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: false,
        })
      },
      confirmProgressDone(param) {
        // Here "param" represents notes/date/whatever: poor design choice.
        if (!dialog.isOpen || !dialog.data || dialog.data.loading) {
          return
        }
        const { calendar, todo, date, mode } = dialog.data
        setDialog({
          isOpen: true,
          data: {
            calendar,
            todo,
            date,
            mode,
            loading: true,
          },
        })
        if (mode === 'done') {
          setTodoAsDoneMutation.mutate(
            {
              calendarId: calendar.id,
              todoId: todo.id,
            },
            {
              onSuccess: () => {
                // Yay!

                fireEventStreamlineUpdated(undefined)
                fireEventCalendarUpdated({ calendarId: calendar.id })

                setDialog({
                  isOpen: false,
                  // data: undefined,
                })
              },
              onError: err => {
                console.error(err)
                // TODO: Tell user all went KO
                alert('Errore avvenuto')
                setDialog({
                  isOpen: true,
                  data: {
                    calendar,
                    todo,
                    date,
                    mode,
                    loading: false,
                  },
                })
              },
            }
          )
        } else if (mode === 'move') {
          if (!param) {
            alert('Empty date')
            return
          }
          updateTodoMutation.mutate(
            {
              calendarId: calendar.id,
              todoId: todo.id,
              fields: {
                date: param,
              },
            },
            {
              onSuccess: () => {
                // Yay!

                fireEventStreamlineUpdated(undefined)
                fireEventCalendarUpdated({ calendarId: calendar.id })

                setDialog({
                  isOpen: false,
                  // data: undefined,
                })
              },
              onError: err => {
                console.error(err)
                // TODO: Tell user all went KO
                alert('Errore avvenuto')
                setDialog({
                  isOpen: true,
                  data: {
                    calendar,
                    todo,
                    date,
                    mode,
                    loading: false,
                  },
                })
              },
            }
          )
        } else if (mode === 'move-done-task') {
          // TODO: In this case "todo" is actually a Task
          if (!param) {
            alert('Empty date')
            return
          }
          updateTaskMutation.mutate(
            {
              calendarId: calendar.id,
              taskId: todo.id,
              fields: {
                date: param,
              },
            },
            {
              onSuccess: () => {
                // Yay!

                fireEventStreamlineUpdated(undefined)
                fireEventCalendarUpdated({ calendarId: calendar.id })

                setDialog({
                  isOpen: false,
                  // data: undefined,
                })
              },
              onError: err => {
                console.error(err)
                // TODO: Tell user all went KO
                alert('Errore avvenuto')
                setDialog({
                  isOpen: true,
                  data: {
                    calendar,
                    todo,
                    date,
                    mode,
                    loading: false,
                  },
                })
              },
            }
          )
        } else if (mode === 'update-notes') {
          updateTodoMutation.mutate(
            {
              calendarId: calendar.id,
              todoId: todo.id,
              fields: {
                notes: param || null,
              },
            },
            {
              onSuccess: () => {
                // Yay!

                // fireEventCalendarUpdated({ calendarId })
                fireEventStreamlineUpdated(undefined)

                setDialog({
                  isOpen: false,
                  // data: undefined,
                })
              },
              onError: err => {
                console.error(err)
                // TODO: Tell user all went KO
                alert('Errore avvenuto')
                setDialog({
                  isOpen: true,
                  data: {
                    calendar,
                    todo,
                    date,
                    mode,
                    loading: false,
                  },
                })
              },
            }
          )
        } else if (mode === 'update-done-task-notes') {
          // TODO: In this case "todo" is actually a Task
          updateTaskMutation.mutate(
            {
              calendarId: calendar.id,
              taskId: todo.id,
              fields: {
                notes: param || null,
              },
            },
            {
              onSuccess: () => {
                // Yay!

                fireEventCalendarUpdated({ calendarId: calendar.id })
                // fireEventStreamlineUpdated(undefined)

                setDialog({
                  isOpen: false,
                  // data: undefined,
                })
              },
              onError: err => {
                console.error(err)
                // TODO: Tell user all went KO
                alert('Errore avvenuto')
                setDialog({
                  isOpen: true,
                  data: {
                    calendar,
                    todo,
                    date,
                    mode,
                    loading: false,
                  },
                })
              },
            }
          )
        } else {
          // Should never happen.
        }
      },
    },
  }
}

export const useDialogForCheckPlannedEvent = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForCheckPlannedEvent
}
