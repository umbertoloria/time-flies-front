import { useState } from 'react'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { getCalendarDateSDK } from '../../remote/remote.ts'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  calendar: {
    id: number
    usesNotes: boolean
  }
  localDate: string
  loading: boolean
}
export type ContextDialogForInsertNewGoal = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (
    calendarId: number,
    calendarUsesNotes: boolean,
    localDate: string
  ) => void
  closeDialog: () => void
  confirmProgressDone: (notes: undefined | string) => void
}
export const contextDialogForInsertNewGoalDataDefault: ContextDialogForInsertNewGoal =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  } as const

const calendarDateSdk = getCalendarDateSDK()
export const useContextDialogForInsertNewGoalForUX = (): {
  dialogForInsertNewGoal: ContextDialogForInsertNewGoal
} => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForInsertNewGoal: {
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
      confirmProgressDone(notes) {
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
        calendarDateSdk
          .checkDateWithSuccess(calendar.id, localDate, notes)
          .then(() => {
            // Yay!

            fireEventCalendarUpdated({ calendarId: calendar.id })
            fireEventStreamlineUpdated(undefined)
            // Because maybe there was a Planned Event right on that day.

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

export const useDialogForInsertNewGoal = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForInsertNewGoal
}
