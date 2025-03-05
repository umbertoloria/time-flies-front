import { useState } from 'react'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { getSDK } from '../../remote/remote.ts'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  calendarId: number
  localDate: string
  loading: boolean
}
export type ContextDialogForInsertNewPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (calendarId: number, localDate: string) => void
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

const { setDateAsPlannedEvent } = getSDK()
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
      openDialog(calendarId, localDate) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            calendarId,
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
        const { calendarId, localDate } = dialog.data
        setDialog({
          isOpen: true,
          data: {
            calendarId,
            localDate,
            loading: true,
          },
        })
        setDateAsPlannedEvent(calendarId, localDate, notes)
          .then(() => {
            // Yay!

            fireEventCalendarUpdated({ calendarId })
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
                calendarId,
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
