import { useState } from 'react'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { useUXContext } from '../UXContext.tsx'
import { getSDK } from '../../remote/remote.ts'

type UXContextTypeDialogForInsertNewGoal = {
  calendarId: number
  localDate: string
  loading: boolean
}
export type UXContextDialogForInsertNewGoalMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForInsertNewGoal
  openDialog: (calendarId: number, localDate: string) => void
  closeDialog: () => void
  confirmProgressDone: () => void
}
export const dialogForInsertNewGoalConst: UXContextDialogForInsertNewGoalMainType =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  } as const
const { checkDateWithSuccess } = getSDK()
export const useUXContextDialogForInsertNewGoal = (): {
  dialogForInsertNewGoal: UXContextDialogForInsertNewGoalMainType
} => {
  const [dialogForInsertNewGoal, setDialogForInsertNewGoal] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForInsertNewGoal
  }>({ isOpen: false })
  return {
    dialogForInsertNewGoal: {
      isOpen: dialogForInsertNewGoal.isOpen,
      data: dialogForInsertNewGoal.data,
      openDialog(calendarId, localDate) {
        if (
          dialogForInsertNewGoal.isOpen ||
          dialogForInsertNewGoal.data?.loading
        ) {
          return
        }
        setDialogForInsertNewGoal({
          ...dialogForInsertNewGoal,
          isOpen: true,
          data: {
            calendarId,
            localDate,
            loading: false,
          },
        })
      },
      closeDialog() {
        if (
          !dialogForInsertNewGoal.isOpen ||
          dialogForInsertNewGoal.data?.loading
        ) {
          return
        }
        setDialogForInsertNewGoal({
          ...dialogForInsertNewGoal,
          isOpen: false,
        })
      },
      confirmProgressDone() {
        if (
          !dialogForInsertNewGoal.isOpen ||
          !dialogForInsertNewGoal.data ||
          dialogForInsertNewGoal.data.loading
        ) {
          return
        }
        const { calendarId, localDate } = dialogForInsertNewGoal.data
        setDialogForInsertNewGoal({
          isOpen: true,
          data: {
            calendarId,
            localDate,
            loading: true,
          },
        })
        checkDateWithSuccess(calendarId, localDate)
          .then(() => {
            // Yay!
            // TODO: Tell user all went OK
            fireEventCalendarUpdated({ calendarId })
            setDialogForInsertNewGoal({
              isOpen: false,
              // data: undefined,
            })
          })
          .catch(err => {
            console.error(err)
            // TODO: Tell user all went KO
            alert('Errore avvenuto')
            setDialogForInsertNewGoal({
              isOpen: true,
              data: {
                calendarId,
                localDate,
                loading: false,
              },
            })
          })
      },
    },
  }
}
export const useUXDialogForInsertNewGoal = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForInsertNewGoal
}
