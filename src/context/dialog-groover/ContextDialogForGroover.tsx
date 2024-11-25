import { useState } from 'react'
import { useUXContext } from '../UXContext.tsx'

type ContextPartData = {
  bass: string
  ghost: string
  hhr: string
}
export type ContextDialogForGroover = {
  isOpen: boolean
  data?: ContextPartData
  openDialog: (data: ContextPartData) => void
  closeDialog: () => void
}
export const contextDialogForGrooverDataDefault: ContextDialogForGroover = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const

export const useContextDialogForGrooverForUX = (): {
  dialogForGroover: ContextDialogForGroover
} => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForGroover: {
      isOpen: dialog.isOpen,
      data: dialog.data,
      openDialog(data) {
        setDialog({ isOpen: true, data })
      },
      closeDialog() {
        // Deleting the old Groover data.
        setDialog({ isOpen: false, data: undefined })
      },
    },
  }
}

export const useDialogForGroover = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForGroover
}
