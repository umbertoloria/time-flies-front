import { getCalendarSDK } from '../../remote/remote.ts'
import { useState } from 'react'
import { fireEventStreamlineUpdated } from '../../components/streamline/event-streamline-updated.ts'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData =
  | {
      mode: 'insert'
      loading: boolean
    }
  | {
      mode: 'update'
      calendarId: number
      // FIXME: Should have more Calendar data
      loading: boolean
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

const calendarSdk = getCalendarSDK()
export const useContextDialogForCalendarManagementForUX = (): {
  dialogForCalendarManagement: ContextDialogForCalendarManagement
} => {
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
          calendarSdk
            .createCalendar({
              name,
              color,
              plannedColor,
              usesNotes,
            })
            .then(() => {
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
            })
            .catch(err => {
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
            })
        } else if (mode === 'update') {
          // FIXME: develop calendar update
          alert('Feature not available')
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
