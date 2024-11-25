import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { DialogForInsertNewGoal } from './dialog-insert-new-goal/DialogForInsertNewGoal.tsx'
import { DialogSeeNotes } from './dialog-see-notes/DialogSeeNotes.tsx'
import { GrooverDialog } from '../components/groover/GrooverDialog.tsx'
import { InputDialogCheckPlannedEvent } from '../components/calendar/InputDialogCheckPlannedEvent.tsx'
import {
  ContextDialogForInsertNewGoal,
  contextDialogForInsertNewGoalDataDefault,
  useContextDialogForInsertNewGoalForUX,
} from './dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import {
  ContextDialogForSeeNotes,
  contextDialogForSeeNotesDataDefault,
  useUXContextDialogForSeeNotesForUX,
} from './dialog-see-notes/UXContextDialogForSeeNotes.tsx'
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
  dialogForInsertNewGoal: ContextDialogForInsertNewGoal
  dialogForSeeNotes: ContextDialogForSeeNotes
  dialogForGroover: UXContextDialogForGrooverMainType
  dialogForCheckPlannedEvent: UXContextDialogForCheckPlannedEventMainType
}>({
  dialogForInsertNewGoal: contextDialogForInsertNewGoalDataDefault,
  dialogForSeeNotes: contextDialogForSeeNotesDataDefault,
  dialogForGroover: dialogForGrooverConst,
  dialogForCheckPlannedEvent: dialogForCheckPlannedEventConst,
})

export const UXProvider: FC<PropsWithChildren> = props => {
  const { dialogForInsertNewGoal } = useContextDialogForInsertNewGoalForUX()
  const { dialogForSeeNotes } = useUXContextDialogForSeeNotesForUX()
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
      <DialogSeeNotes />
      <GrooverDialog />
      <InputDialogCheckPlannedEvent />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}
