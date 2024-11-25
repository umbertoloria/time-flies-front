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
import { InputDialogCheckPlannedEvent } from '../components/calendar/InputDialogCheckPlannedEvent.tsx'
import { fireEventStreamlineUpdated } from '../components/streamline/event-streamline-updated.ts'

const { checkDateWithSuccess, checkPlannedEventWithSuccess } = getSDK()

// UX Context: Dialog For Insert New Goal
type UXContextTypeDialogForInsertNewGoal = {
  calendarId: number
  localDate: string
  loading: boolean
}
type UXContextDialogForInsertNewGoalMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForInsertNewGoal
  openDialog: (calendarId: number, localDate: string) => void
  closeDialog: () => void
  confirmProgressDone: () => void
}
const dialogForInsertNewGoalConst: UXContextDialogForInsertNewGoalMainType = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
  confirmProgressDone() {},
} as const
const useUXContextDialogForInsertNewGoal = (): {
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
  }
}
export const useUXDialogForInsertNewGoal = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForInsertNewGoal
}

// UX Context: Dialog For Insert New Goal
type UXContextTypeDialogForSeeNotes = {
  notes: string
}
type UXContextDialogForSeeNotesMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForSeeNotes
  openDialog: (notes: string) => void
  closeDialog: () => void
}
const dialogForSeeNotesConst: UXContextDialogForSeeNotesMainType = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const
const useUXContextDialogForSeeNotes = (): {
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

// UX Context: Dialog For Groover
type UXContextTypeDialogForGroover = {
  bass: string
  ghost: string
  hhr: string
}
type UXContextDialogForGrooverMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForGroover
  openDialog: (data: UXContextTypeDialogForGroover) => void
  closeDialog: () => void
}
const dialogForGrooverConst: UXContextDialogForGrooverMainType = {
  isOpen: false,
  // data: undefined,
  openDialog() {},
  closeDialog() {},
} as const
const useUXContextDialogForGroover = (): {
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
export const useGrooverDialog = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForGroover
}

// UX Context: Dialog For Check Planned Events
type UXContextTypeDialogForCheckPlannedEvent = {
  calendarId: number
  eventId: number
  loading: boolean
}
type UXContextDialogForCheckPlannedEventMainType = {
  isOpen: boolean
  data?: UXContextTypeDialogForCheckPlannedEvent
  openDialog: (calendarId: number, eventId: number) => void
  closeDialog: () => void
  confirmProgressDone: () => void
}
const dialogForCheckPlannedEventConst: UXContextDialogForCheckPlannedEventMainType =
  {
    isOpen: false,
    // data: undefined,
    openDialog() {},
    closeDialog() {},
    confirmProgressDone() {},
  } as const
const useUXContextDialogForCheckPlannedEvents = (): {
  dialogForCheckPlannedEvent: UXContextDialogForCheckPlannedEventMainType
} => {
  const [dialogForCheckPlannedEvent, setDialogForCheckPlannedEvent] = useState<{
    isOpen: boolean
    data?: UXContextTypeDialogForCheckPlannedEvent
  }>({ isOpen: false })
  return {
    dialogForCheckPlannedEvent: {
      isOpen: dialogForCheckPlannedEvent.isOpen,
      data: dialogForCheckPlannedEvent.data,
      openDialog(calendarId, eventId) {
        if (
          dialogForCheckPlannedEvent.isOpen ||
          dialogForCheckPlannedEvent.data?.loading
        ) {
          return
        }
        setDialogForCheckPlannedEvent({
          ...dialogForCheckPlannedEvent,
          isOpen: true,
          data: {
            calendarId,
            eventId,
            loading: false,
          },
        })
      },
      closeDialog() {
        if (
          !dialogForCheckPlannedEvent.isOpen ||
          dialogForCheckPlannedEvent.data?.loading
        ) {
          return
        }
        setDialogForCheckPlannedEvent({
          ...dialogForCheckPlannedEvent,
          isOpen: false,
        })
      },
      confirmProgressDone() {
        if (
          !dialogForCheckPlannedEvent.isOpen ||
          !dialogForCheckPlannedEvent.data ||
          dialogForCheckPlannedEvent.data.loading
        ) {
          return
        }
        const { calendarId, eventId } = dialogForCheckPlannedEvent.data
        setDialogForCheckPlannedEvent({
          isOpen: true,
          data: {
            calendarId,
            eventId,
            loading: true,
          },
        })
        // TODO: De-couple this component from this logic
        checkPlannedEventWithSuccess(calendarId, eventId)
          .then(() => {
            // Yay!
            fireEventStreamlineUpdated(undefined)
            setDialogForCheckPlannedEvent({
              isOpen: false,
              // data: undefined,
            })
          })
          .catch(err => {
            console.error(err)
            // TODO: Tell user all went KO
            alert('Errore avvenuto')
            setDialogForCheckPlannedEvent({
              isOpen: true,
              data: {
                calendarId,
                eventId,
                loading: false,
              },
            })
          })
      },
    },
  }
}
export const useUXDialogForCheckPlannedEvent = () => {
  const uxContext = useUXContext()
  return uxContext.dialogForCheckPlannedEvent
}

// UX Context
const UXContext = createContext<{
  dialogForInsertNewGoal: UXContextDialogForInsertNewGoalMainType
  dialogForSeeNotes: UXContextDialogForSeeNotesMainType
  dialogForGroover: UXContextDialogForGrooverMainType
  dialogForCheckPlannedEvent: UXContextDialogForCheckPlannedEventMainType
}>({
  dialogForInsertNewGoal: dialogForInsertNewGoalConst,
  dialogForSeeNotes: dialogForSeeNotesConst,
  dialogForGroover: dialogForGrooverConst,
  dialogForCheckPlannedEvent: dialogForCheckPlannedEventConst,
})

export const UXProvider: FC<PropsWithChildren> = props => {
  const { dialogForInsertNewGoal } = useUXContextDialogForInsertNewGoal()
  const { dialogForSeeNotes } = useUXContextDialogForSeeNotes()
  const { dialogForGroover } = useUXContextDialogForGroover()
  const { dialogForCheckPlannedEvent } =
    useUXContextDialogForCheckPlannedEvents()

  return (
    <UXContext.Provider
      value={{
        dialogForInsertNewGoal,
        dialogForSeeNotes,
        dialogForGroover,
        dialogForCheckPlannedEvent,
      }}
    >
      <InputDialogInsertNewGoal />
      <InputDialogSeeNotes />
      <GrooverDialog />
      <InputDialogCheckPlannedEvent />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}
