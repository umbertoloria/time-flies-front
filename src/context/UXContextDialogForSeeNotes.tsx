import { useState } from 'react'
import { useUXContext } from './UXContext.tsx'

type UXContextTypeDialogForSeeNotes = {
  notes: string
}
export type UXContextDialogForSeeNotesMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForSeeNotes
  openDialog: (notes: string) => void
  closeDialog: () => void
}
export const dialogForSeeNotesConst: UXContextDialogForSeeNotesMainType = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const
export const useUXContextDialogForSeeNotes = (): {
  dialogForSeeNotes: UXContextDialogForSeeNotesMainType
} => {
  const [dialogForSeeNotes, setDialogForSeeNotes] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForSeeNotes
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
export const useUXDialogForSeeNotes = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForSeeNotes
}
