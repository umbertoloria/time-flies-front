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
  const [dialogForSeeNotes, setDialogForSeeNotes] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForSeeNotes: {
      isOpen: dialogForSeeNotes.isOpen,
      data: dialogForSeeNotes.data,
      openDialog(notes) {
        if (dialogForSeeNotes.isOpen) {
          return
        }
        setDialogForSeeNotes({
          ...dialogForSeeNotes,
          isOpen: true,
          data: {
            notes,
          },
        })
      },
      closeDialog() {
        if (!dialogForSeeNotes.isOpen || !dialogForSeeNotes.data) {
          return
        }
        setDialogForSeeNotes({
          ...dialogForSeeNotes,
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
