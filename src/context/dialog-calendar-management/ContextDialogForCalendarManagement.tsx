import { useState } from 'react'
import { fireEventCalendarUpdated } from '@/components/calendar/event-calendar-updated'
import { fireEventStreamlineUpdated } from '@/components/streamline/event-streamline-updated'
import { useUXContext } from '@/context/UXContext'
import {
  useCreateCalendar,
  useUpdateCalendar,
} from '@/remote/useCalendarQueries'
import { TCalendar } from '@/remote/sdk/types'

type ContextPartData =
  | {
      mode: 'insert'
      loading: boolean
    }
  | {
      mode: 'update'
      loading: boolean
      calendar: TCalendar
    }
export type ContextDialogForCalendarManagement = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (data: ContextPartData) => void
  closeDialog: () => void
  confirmOperation: (
    name: string,
    color: string,
    plannedColor: string,
    usesNotes: boolean
  ) => void
}
export const contextDialogForCalendarManagementDataDefault: ContextDialogForCalendarManagement =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmOperation() {},
  } as const

export const useContextDialogForCalendarManagementForUX = (): {
  dialogForCalendarManagement: ContextDialogForCalendarManagement
} => {
  const createCalendarMutation = useCreateCalendar()
  const updateCalendarMutation = useUpdateCalendar()

  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })

  return {
    dialogForCalendarManagement: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(data) {
        if (dialog.isOpen || dialog.data?.loading) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            ...data,
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
      confirmOperation(name, color, plannedColor, usesNotes) {
        if (!dialog.isOpen || !dialog.data || dialog.data.loading) {
          return
        }
        const { mode } = dialog.data
        setDialog({
          isOpen: true,
          data: {
            ...dialog.data,
            loading: true,
          },
        })
        if (mode === 'insert') {
          createCalendarMutation.mutate(
            {
              name,
              color,
              plannedColor,
              usesNotes,
            },
            {
              onSuccess: () => {
                // Yay!

                fireEventStreamlineUpdated(undefined)
                // fireEventCalendarUpdated({ calendarId: 7 })
                // FIXME: This work-around would be very very bad!
                location.reload()
                // TODO: Avoid refreshing the whole page

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
                    mode,
                    loading: false,
                  },
                })
              },
            }
          )
        } else if (mode === 'update') {
          const { calendar } = dialog.data
          updateCalendarMutation.mutate(
            {
              id: calendar.id,
              data: {
                name,
                color,
                plannedColor,
                usesNotes,
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
                    mode,
                    loading: false,
                    calendar,
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

export const useDialogForCalendarManagement = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForCalendarManagement
}
