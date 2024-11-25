import { getSDK } from '../../remote/remote.ts'
import { useState } from 'react'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  calendarId: number
  eventId: number
  loading: boolean
}
export type ContextDialogForCheckPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (calendarId: number, eventId: number) => void
  closeDialog: () => void
  confirmProgressDone: () => void
}
export const contextDialogForCheckPlannedEventDataDefault: ContextDialogForCheckPlannedEvent =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  } as const

const { checkPlannedEventWithSuccess } = getSDK()
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
      openDialog(calendarId, eventId) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            calendarId,
            eventId,
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
      confirmProgressDone() {
        if (!dialog.isOpen || !dialog.data || dialog.data.loading) {
          return
        }
        const { calendarId, eventId } = dialog.data
        setDialog({
          isOpen: true,
          data: {
            calendarId,
            eventId,
            loading: true,
          },
        })
        checkPlannedEventWithSuccess(calendarId, eventId)
          .then(() => {
            // Yay!
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
                calendarId,
                eventId,
                loading: false,
              },
            })
          })
      },
    },
  }
}

export const useDialogForCheckPlannedEvent = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForCheckPlannedEvent
}
