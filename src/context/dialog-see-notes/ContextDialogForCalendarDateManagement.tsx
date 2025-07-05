import { useState } from 'react'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  calendarId: number
  date: string // Es. "2025-02-26"
  notes?: ContextPartDataNotes
}
type ContextPartDataNotes = {
  text: string
}
export type ContextDialogForCalendarDateManagement = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (data: ContextPartData) => void
  closeDialog: () => void
}
export const contextDialogForCalendarDateManagementDataDefault: ContextDialogForCalendarDateManagement =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
  } as const

export const useUXContextDialogForCalendarDateManagementForUX = (): {
  dialogForCalendarDateManagement: ContextDialogForCalendarDateManagement
} => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForCalendarDateManagement: {
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

export const useDialogForCalendarDateManagement = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForCalendarDateManagement
}
