import { useState } from 'react'
import { fireEventCalendarUpdated } from '@/components/calendar/event-calendar-updated'
import { fireEventStreamlineUpdated } from '@/components/streamline/event-streamline-updated'
import { useUXContext } from '@/context/UXContext'
import { getCalendarDateSDK, getPlannedEventSDK } from '@/remote/remote'
import { TCalendarRcd, TNewTodo } from '@/remote/sdk/types'

type DialogForCheckPlannedEventsMode =
  | 'done'
  | 'missed'
  | 'move'
  | 'move-done-task'
  | 'update-notes'
  | 'update-done-task-notes'

type ContextPartData = {
  calendar: TCalendarRcd
  date: string
  todo: TNewTodo
  mode: DialogForCheckPlannedEventsMode
  loading: boolean
}
export type ContextDialogForCheckPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (
    calendar: TCalendarRcd,
    date: string,
    todo: TNewTodo,
    mode: DialogForCheckPlannedEventsMode
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

const calendarDateSdk = getCalendarDateSDK()
const plannedEventSdk = getPlannedEventSDK()
export const useContextDialogForCheckPlannedEventForUX = (): {
  dialogForCheckPlannedEvent: ContextDialogForCheckPlannedEvent
} => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForCheckPlannedEvent: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(calendar, date, todo, mode) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            calendar,
            date,
            todo,
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
        const { calendar, date, todo, mode } = dialog.data
        if (mode === 'missed') {
          // FIXME: remove deprecated "missed" feature
          alert('Deprecated feature')
          return
        }
        setDialog({
          isOpen: true,
          data: {
            calendar,
            date,
            todo,
            mode,
            loading: true,
          },
        })
        if (mode === 'done') {
          plannedEventSdk
            .setTodoAsDone(calendar.id, todo.id, param)
            .then(() => {
              // Yay!

              fireEventStreamlineUpdated(undefined)
              fireEventCalendarUpdated({ calendarId: calendar.id })

              setDialog({
                isOpen: false,
                // data: undefined,
              })
            })
            .catch(err => {
              console.error(err)
              // TODO: Tell user all went KO
              alert('Errore avvenuto')
              setDialog({
                isOpen: true,
                data: {
                  calendar,
                  date,
                  todo,
                  mode,
                  loading: false,
                },
              })
            })
        } else if (mode === 'move') {
          if (!param) {
            alert('Empty date')
            return
          }
          plannedEventSdk
            .updateTodo(calendar.id, todo.id, {
              date: param,
            })
            .then(() => {
              // Yay!

              fireEventStreamlineUpdated(undefined)
              fireEventCalendarUpdated({ calendarId: calendar.id })

              setDialog({
                isOpen: false,
                // data: undefined,
              })
            })
            .catch(err => {
              console.error(err)
              // TODO: Tell user all went KO
              alert('Errore avvenuto')
              setDialog({
                isOpen: true,
                data: {
                  calendar,
                  date,
                  todo,
                  mode,
                  loading: false,
                },
              })
            })
        } else if (mode === 'move-done-task') {
          // TODO: In this case "todo" is actually a Task
          if (!param) {
            alert('Empty date')
            return
          }
          calendarDateSdk
            .updateTask(calendar.id, todo.id, {
              date: param,
            })
            .then(() => {
              // Yay!

              fireEventStreamlineUpdated(undefined)
              fireEventCalendarUpdated({ calendarId: calendar.id })

              setDialog({
                isOpen: false,
                // data: undefined,
              })
            })
            .catch(err => {
              console.error(err)
              // TODO: Tell user all went KO
              alert('Errore avvenuto')
              setDialog({
                isOpen: true,
                data: {
                  calendar,
                  date,
                  todo,
                  mode,
                  loading: false,
                },
              })
            })
        } else if (mode === 'update-notes') {
          plannedEventSdk
            .updateTodo(calendar.id, todo.id, {
              notes: param || null,
            })
            .then(() => {
              // Yay!

              // fireEventCalendarUpdated({ calendarId })
              fireEventStreamlineUpdated(undefined)

              setDialog({
                isOpen: false,
                // data: undefined,
              })
            })
            .catch(err => {
              console.error(err)
              // TODO: Tell user all went KO
              alert('Errore avvenuto')
              setDialog({
                isOpen: true,
                data: {
                  calendar,
                  date,
                  todo,
                  mode,
                  loading: false,
                },
              })
            })
        } else if (mode === 'update-done-task-notes') {
          // TODO: In this case "todo" is actually a Task
          calendarDateSdk
            .updateTask(calendar.id, todo.id, {
              notes: param || null,
            })
            .then(() => {
              // Yay!

              fireEventCalendarUpdated({ calendarId: calendar.id })
              // fireEventStreamlineUpdated(undefined)

              setDialog({
                isOpen: false,
                // data: undefined,
              })
            })
            .catch(err => {
              console.error(err)
              // TODO: Tell user all went KO
              alert('Errore avvenuto')
              setDialog({
                isOpen: true,
                data: {
                  calendar,
                  date,
                  todo,
                  mode,
                  loading: false,
                },
              })
            })
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
