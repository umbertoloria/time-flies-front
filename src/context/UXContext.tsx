import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { DialogForInsertNewGoal } from './dialog-insert-new-goal/DialogForInsertNewGoal.tsx'
import { InputDialogSeeNotes } from '../components/calendar/InputDialogSeeNotes.tsx'
import { GrooverDialog } from '../components/groover/GrooverDialog.tsx'
import { InputDialogCheckPlannedEvent } from '../components/calendar/InputDialogCheckPlannedEvent.tsx'
import {
  dialogForInsertNewGoalConst,
  useUXContextDialogForInsertNewGoal,
  UXContextDialogForInsertNewGoalMainType,
} from './dialog-insert-new-goal/UXContextDialogForInsertNewGoal.tsx'
import {
  dialogForSeeNotesConst,
  useUXContextDialogForSeeNotes,
  UXContextDialogForSeeNotesMainType,
} from './UXContextDialogForSeeNotes.tsx'
import {
  dialogForGrooverConst,
  useUXContextDialogForGroover,
  UXContextDialogForGrooverMainType,
} from './UXContextDialogForGroover.tsx'
import {
  dialogForCheckPlannedEventConst,
  useUXContextDialogForCheckPlannedEvents,
  UXContextDialogForCheckPlannedEventMainType,
} from './UXContextDialogForCheckPlannedEvents.tsx'

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
      <DialogForInsertNewGoal />
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
