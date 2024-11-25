import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { DialogForInsertNewGoal } from './dialog-insert-new-goal/DialogForInsertNewGoal.tsx'
import { DialogSeeNotes } from './dialog-see-notes/DialogSeeNotes.tsx'
import { DialogForGroover } from './dialog-groover/DialogForGroover.tsx'
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
  ContextDialogForGroover,
  contextDialogForGrooverDataDefault,
  useContextDialogForGrooverForUX,
} from './dialog-groover/ContextDialogForGroover.tsx'
import {
  dialogForCheckPlannedEventConst,
  useUXContextDialogForCheckPlannedEvents,
  UXContextDialogForCheckPlannedEventMainType,
} from './UXContextDialogForCheckPlannedEvents.tsx'

const UXContext = createContext<{
  dialogForInsertNewGoal: ContextDialogForInsertNewGoal
  dialogForSeeNotes: ContextDialogForSeeNotes
  dialogForGroover: ContextDialogForGroover
  dialogForCheckPlannedEvent: UXContextDialogForCheckPlannedEventMainType
}>({
  dialogForInsertNewGoal: contextDialogForInsertNewGoalDataDefault,
  dialogForSeeNotes: contextDialogForSeeNotesDataDefault,
  dialogForGroover: contextDialogForGrooverDataDefault,
  dialogForCheckPlannedEvent: dialogForCheckPlannedEventConst,
})

export const UXProvider: FC<PropsWithChildren> = props => {
  const { dialogForInsertNewGoal } = useContextDialogForInsertNewGoalForUX()
  const { dialogForSeeNotes } = useUXContextDialogForSeeNotesForUX()
  const { dialogForGroover } = useContextDialogForGrooverForUX()
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
      <DialogForGroover />
      <InputDialogCheckPlannedEvent />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}
