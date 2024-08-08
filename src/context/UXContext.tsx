import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'
import { InputDialogDayStatus } from '../components/calendar/InputDialogDayStatus.tsx'
import { checkDateWithSuccess } from '../remote/remote.ts'
import { fireEventCalendarUpdated } from '../events/calendar-events.ts'

type UXContextTypeInputDialogData = {
  calendarId: number
  localDate: string
  loading: boolean
}
const UXContext = createContext<{
  inputDialog: {
    isOpen: boolean
    data?: UXContextTypeInputDialogData
    openInputDialog: (calendarId: number, localDate: string) => void
    closeInputDialog: () => void
    confirmProgressDone: () => void
  }
}>({
  inputDialog: {
    isOpen: false,
    // data: undefined,
    openInputDialog() {},
    closeInputDialog() {},
    confirmProgressDone() {},
  },
})

export const UXProvider: FC<PropsWithChildren> = props => {
  const [inputDialog, setInputDialog] = useState<{
    isOpen: boolean
    data?: UXContextTypeInputDialogData
  }>({ isOpen: false })

  return (
    <UXContext.Provider
      value={{
        inputDialog: {
          isOpen: inputDialog.isOpen,
          data: inputDialog.data,
          openInputDialog(calendarId, localDate) {
            if (inputDialog.isOpen || inputDialog.data?.loading) {
              return
            }
            setInputDialog({
              ...inputDialog,
              isOpen: true,
              data: {
                calendarId,
                localDate,
                loading: false,
              },
            })
          },
          closeInputDialog() {
            if (!inputDialog.isOpen || inputDialog.data?.loading) {
              return
            }
            setInputDialog({
              ...inputDialog,
              isOpen: false,
            })
          },
          confirmProgressDone() {
            if (
              !inputDialog.isOpen ||
              !inputDialog.data ||
              inputDialog.data.loading
            ) {
              return
            }
            const { calendarId, localDate } = inputDialog.data
            setInputDialog({
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
                fireEventCalendarUpdated(calendarId)
                setInputDialog({
                  isOpen: false,
                  // data: undefined,
                })
              })
              .catch(err => {
                console.error(err)
                // TODO: Tell user all went KO
                alert('Errore avvenuto')
                setInputDialog({
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
      }}
    >
      <InputDialogDayStatus />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}

export const useUXInputDialogControls = () => {
  const uxContext = useUXContext()
  return uxContext.inputDialog
}
