import { useState } from 'react'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData =
  | {
      mode: 'calendar-date-panel'
      calendarId: number
      date: string // Es. "2025-02-26"
    }
  | {
      mode: 'calendar-panel'
      calendarId: number
    }
export type ContextDialogForDatePanel = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (data: ContextPartData) => void
  closeDialog: () => void
}
export const contextDialogForDatePanelDataDefault: ContextDialogForDatePanel = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const

export const useUXContextDialogForDatePanelForUX = (): {
  dialogForDatePanel: ContextDialogForDatePanel
} => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForDatePanel: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(data) {
        if (dialog.isOpen) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data,
        })
      },
      closeDialog() {
        if (!dialog.isOpen || !dialog.data) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: false,
        })
      },
    },
  }
}

export const useDialogForDatePanel = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForDatePanel
}
