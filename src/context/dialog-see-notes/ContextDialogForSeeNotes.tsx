import { useState } from 'react'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  notes: string
}
export type ContextDialogForSeeNotes = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (notes: string) => void
  closeDialog: () => void
}
export const contextDialogForSeeNotesDataDefault: ContextDialogForSeeNotes = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const

export const useUXContextDialogForSeeNotesForUX = (): {
  dialogForSeeNotes: ContextDialogForSeeNotes
} => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForSeeNotes: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(notes) {
        if (dialog.isOpen) {
          return
        }
        setDialog({
          ...dialog,
          isOpen: true,
          data: {
            notes,
          },
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

export const useDialogForSeeNotes = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForSeeNotes
}
