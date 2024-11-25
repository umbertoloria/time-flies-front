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
  const [dialogForGroover, setDialogForGroover] = useState<{
    isOpen: boolean
    data?: ContextPartData
  }>({ isOpen: false })
  return {
    dialogForGroover: {
      isOpen: dialogForGroover.isOpen,
      data: dialogForGroover.data,
      openDialog(data) {
        setDialogForGroover({ isOpen: true, data })
      },
      closeDialog() {
        // Deleting the old Groover data.
        setDialogForGroover({ isOpen: false, data: undefined })
      },
    },
  }
}

export const useDialogForGroover = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForGroover
}
