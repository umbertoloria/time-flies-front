import { getSDK } from '../remote/remote.ts'
import { useState } from 'react'
import { fireEventStreamlineUpdated } from '../components/streamline/event-streamline-updated.ts'
import { useUXContext } from './UXContext.tsx'

type UXContextTypeDialogForCheckPlannedEvent = {
  calendarId: number
  eventId: number
  loading: boolean
}
export type UXContextDialogForCheckPlannedEventMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForCheckPlannedEvent
  openDialog: (calendarId: number, eventId: number) => void
  closeDialog: () => void
  confirmProgressDone: () => void
}
export const dialogForCheckPlannedEventConst: UXContextDialogForCheckPlannedEventMainType =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  } as const
const { checkPlannedEventWithSuccess } = getSDK()
export const useUXContextDialogForCheckPlannedEvents = (): {
  dialogForCheckPlannedEvent: UXContextDialogForCheckPlannedEventMainType
} => {
  const [dialogForCheckPlannedEvent, setDialogForCheckPlannedEvent] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForCheckPlannedEvent
  }>({ isOpen: false })
  return {
    dialogForCheckPlannedEvent: {
      isOpen: dialogForCheckPlannedEvent.isOpen,
      data: dialogForCheckPlannedEvent.data,
      openDialog(calendarId, eventId) {
        if (
          dialogForCheckPlannedEvent.isOpen ||
          dialogForCheckPlannedEvent.data?.loading
        ) {
          return
        }
        setDialogForCheckPlannedEvent({
          ...dialogForCheckPlannedEvent,
          isOpen: true,
          data: {
            calendarId,
            eventId,
            loading: false,
          },
        })
      },
      closeDialog() {
        if (
          !dialogForCheckPlannedEvent.isOpen ||
          dialogForCheckPlannedEvent.data?.loading
        ) {
          return
        }
        setDialogForCheckPlannedEvent({
          ...dialogForCheckPlannedEvent,
          isOpen: false,
        })
      },
      confirmProgressDone() {
        if (
          !dialogForCheckPlannedEvent.isOpen ||
          !dialogForCheckPlannedEvent.data ||
          dialogForCheckPlannedEvent.data.loading
        ) {
          return
        }
        const { calendarId, eventId } = dialogForCheckPlannedEvent.data
        setDialogForCheckPlannedEvent({
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
            setDialogForCheckPlannedEvent({
              isOpen: false,
              // data: undefined,
            })
          })
          .catch(err => {
            console.error(err)
            // TODO: Tell user all went KO
            alert('Errore avvenuto')
            setDialogForCheckPlannedEvent({
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
export const useUXDialogForCheckPlannedEvent = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForCheckPlannedEvent
}
