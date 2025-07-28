import { getSDK } from '../../remote/remote.ts'
import { useState } from 'react'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { useUXContext } from '../UXContext.tsx'
import { TCalendarRcd, TNewTodo } from '../../remote/sdk/types'

type ContextPartData = {
  calendar: TCalendarRcd
  date: string
  todo: TNewTodo
  mode: 'done' | 'missed' | 'move' | 'update-notes' | 'update-done-task-notes'
  loading: boolean
}
export type ContextDialogForCheckPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (
    calendar: TCalendarRcd,
    date: string,
    todo: TNewTodo,
    mode: 'done' | 'missed' | 'move' | 'update-notes' | 'update-done-task-notes'
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

const {
  checkPlannedEventWithSuccess,
  movePlannedEvent,
  updatePlannedEventNotes,
  updateCalendarDateNotes,
} = getSDK()
export const useContextDialogForCheckPlannedEventsForUX = (): {
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
        if (mode === 'done' || mode === 'missed') {
          checkPlannedEventWithSuccess(
            calendar.id,
            todo.id,
            mode === 'done'
              ? {
                  type: 'done',
                  notes: param,
                }
              : {
                  type: 'missed',
                }
          )
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
          movePlannedEvent(calendar.id, todo.id, param)
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
          updatePlannedEventNotes(calendar.id, todo.id, param || undefined)
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
          updateCalendarDateNotes(calendar.id, date, param || undefined)
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
