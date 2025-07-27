import { getSDK } from '../../remote/remote.ts'
import { useState } from 'react'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  calendarId: number
  eventId: number
  date: string
  mode: 'done' | 'missed' | 'move'
  loading: boolean
}
export type ContextDialogForCheckPlannedEvent = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (
    calendarId: number,
    date: string,
    eventId: number,
    mode: 'done' | 'missed' | 'move'
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

const { checkPlannedEventWithSuccess, movePlannedEvent } = getSDK()
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
      openDialog(calendarId, date, eventId, mode) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            calendarId,
            date,
            eventId,
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
        if (!dialog.isOpen || !dialog.data || dialog.data.loading) {
          return
        }
        const { calendarId, date, eventId, mode } = dialog.data
        setDialog({
          isOpen: true,
          data: {
            calendarId,
            date,
            eventId,
            mode,
            loading: true,
          },
        })
        if (mode === 'done' || mode === 'missed') {
          checkPlannedEventWithSuccess(
            calendarId,
            eventId,
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
              fireEventCalendarUpdated({ calendarId })

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
                  date,
                  eventId,
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
          movePlannedEvent(calendarId, eventId, param)
            .then(() => {
              // Yay!

              fireEventStreamlineUpdated(undefined)
              fireEventCalendarUpdated({ calendarId })

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
                  date,
                  eventId,
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
