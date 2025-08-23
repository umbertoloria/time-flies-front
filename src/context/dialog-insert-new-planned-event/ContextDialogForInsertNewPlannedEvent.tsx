import { useState } from 'react'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { getSDK } from '../../remote/remote.ts'
import { useUXContext } from '../UXContext.tsx'

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

const { plannedEventSdk } = getSDK()
export const useContextDialogForInsertNewPlannedEventForUX = (): {
  dialogForInsertNewPlannedEvent: ContextDialogForInsertNewPlannedEvent
} => {
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
        plannedEventSdk
          .setDateAsPlannedEvent(calendar.id, localDate, notes)
          .then(() => {
            // Yay!

            fireEventCalendarUpdated({ calendarId: calendar.id })
            fireEventStreamlineUpdated(undefined)
            // Because there is a new Planned Event to be shown.

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
                calendar: {
                  id: calendar.id,
                  usesNotes: calendar.usesNotes,
                },
                localDate,
                loading: false,
              },
            })
          })
      },
    },
  }
}

export const useDialogForInsertNewPlannedEvent = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForInsertNewPlannedEvent
}
