import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'
import { InputDialogInsertNewGoal } from '../components/calendar/InputDialogInsertNewGoal.tsx'
import { getSDK } from '../remote/remote.ts'
import { fireEventCalendarUpdated } from '../components/calendar/event-calendar-updated.ts'
import { InputDialogSeeNotes } from '../components/calendar/InputDialogSeeNotes.tsx'
import { GrooverDialog } from '../components/groover/GrooverDialog.tsx'

type UXContextTypeDialogForInsertNewGoal = {
  calendarId: number
  localDate: string
  loading: boolean
}
type UXContextTypeDialogForSeeNotes = {
  notes: string
}
export type GrooverData = {
  bass: string
  ghost: string
  hhr: string
}
const UXContext = createContext<{
  dialogForInsertNewGoal: {
    isOpen: boolean
    data?: UXContextTypeDialogForInsertNewGoal
    openDialog: (calendarId: number, localDate: string) => void
    closeDialog: () => void
    confirmProgressDone: () => void
  }
  dialogForSeeNotes: {
    isOpen: boolean
    data?: UXContextTypeDialogForSeeNotes
    openDialog: (notes: string) => void
    closeDialog: () => void
  }
  dialogForGroover: {
    isOpen: boolean
    data?: GrooverData
    openDialog: (data: GrooverData) => void
    closeDialog: () => void
  }
}>({
  dialogForInsertNewGoal: {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  },
  dialogForSeeNotes: {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
  },
  dialogForGroover: {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
  },
})

const { checkDateWithSuccess } = getSDK()
export const UXProvider: FC<PropsWithChildren> = props => {
  const [dialogForInsertNewGoal, setDialogForInsertNewGoal] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForInsertNewGoal
  }>({ isOpen: false })

  const [dialogForSeeNotes, setDialogForSeeNotes] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForSeeNotes
  }>({ isOpen: false })

  const [dialogForGroover, setDialogForGroover] = useState<{
    isOpen: boolean
    data?: GrooverData
  }>({ isOpen: false })

  return (
    <UXContext.Provider
      value={{
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
            // TODO: De-couple this component from this logic
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
      }}
    >
      <InputDialogInsertNewGoal />
      <InputDialogSeeNotes />
      <GrooverDialog />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}
export const useUXDialogForInsertNewGoal = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForInsertNewGoal
}
export const useUXDialogForSeeNotes = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForSeeNotes
}
export const useGrooverDialog = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForGroover
}
