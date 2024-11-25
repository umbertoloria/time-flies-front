import { useState } from 'react'
import { useUXContext } from './UXContext.tsx'

type UXContextTypeDialogForGroover = {
  bass: string
  ghost: string
  hhr: string
}
export type UXContextDialogForGrooverMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForGroover
  openDialog: (data: UXContextTypeDialogForGroover) => void
  closeDialog: () => void
}
export const dialogForGrooverConst: UXContextDialogForGrooverMainType = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const
export const useUXContextDialogForGroover = (): {
  dialogForGroover: UXContextDialogForGrooverMainType
} => {
  const [dialogForGroover, setDialogForGroover] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForGroover
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
export const useUXDialogForGroover = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForGroover
}
