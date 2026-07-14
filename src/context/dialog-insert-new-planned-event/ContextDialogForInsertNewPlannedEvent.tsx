import { useState } from 'react'
import { fireEventCalendarUpdated } from '@/components/calendar/event-calendar-updated'
import { fireEventStreamlineUpdated } from '@/components/streamline/event-streamline-updated'
import { useUXContext } from '@/context/UXContext'
import { useCreateTodo } from '@/remote/useCalendarQueries'

type ContextPartData = {
  calendar: {
    id: number
    usesNotes: boolean
  }
  localDate: string
  loading: boolean
}
export type ContextDialogForInsertNewPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (
    calendarId: number,
    calendarUsesNotes: boolean,
    localDate: string
  ) => void
  closeDialog: () => void
  confirmProgressToDo: (notes: undefined | string) => void
}
export const contextDialogForInsertNewPlannedEventDataDefault: ContextDialogForInsertNewPlannedEvent =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressToDo() {},
  } as const

export const useContextDialogForInsertNewPlannedEventForUX = (): {
  dialogForInsertNewPlannedEvent: ContextDialogForInsertNewPlannedEvent
} => {
  const createTodoMutation = useCreateTodo()

  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })

  return {
    dialogForInsertNewPlannedEvent: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(calendarId, calendarUsesNotes, localDate) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          isOpen: true,
          data: {
            calendar: {
              id: calendarId,
              usesNotes: calendarUsesNotes,
            },
            localDate,
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
      confirmProgressToDo(notes) {
        if (!dialog.isOpen || !dialog.data || dialog.data.loading) {
          return
        }
        const { calendar, localDate } = dialog.data
        setDialog({
          isOpen: true,
          data: {
            calendar: {
              id: calendar.id,
              usesNotes: calendar.usesNotes,
            },
            localDate,
            loading: true,
          },
        })
        createTodoMutation.mutate(
          {
            calendarId: calendar.id,
            localDate,
            notes,
          },
          {
            onSuccess: () => {
              // Yay!

              fireEventCalendarUpdated({ calendarId: calendar.id })
              fireEventStreamlineUpdated(undefined)
              // Because there is a new Planned Event to be shown.

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
                  calendar: {
                    id: calendar.id,
                    usesNotes: calendar.usesNotes,
                  },
                  localDate,
                  loading: false,
                },
              })
            },
          }
        )
      },
    },
  }
}

export const useDialogForInsertNewPlannedEvent = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForInsertNewPlannedEvent
}
