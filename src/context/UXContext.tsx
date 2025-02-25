import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { DialogForInsertNewGoal } from './dialog-insert-new-goal/DialogForInsertNewGoal.tsx'
import { DialogSeeNotes } from './dialog-see-notes/DialogSeeNotes.tsx'
import { DialogForGroover } from './dialog-groover/DialogForGroover.tsx'
import { DialogCheckPlannedEvent } from './dialog-check-planned-events/DialogCheckPlannedEvent.tsx'
import {
  ContextDialogForInsertNewGoal,
  contextDialogForInsertNewGoalDataDefault,
  useContextDialogForInsertNewGoalForUX,
} from './dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import {
  ContextDialogForSeeNotes,
  contextDialogForSeeNotesDataDefault,
  useUXContextDialogForSeeNotesForUX,
} from './dialog-see-notes/ContextDialogForSeeNotes.tsx'
import {
  ContextDialogForGroover,
  contextDialogForGrooverDataDefault,
  useContextDialogForGrooverForUX,
} from './dialog-groover/ContextDialogForGroover.tsx'
import {
  ContextDialogForCheckPlannedEvent,
  contextDialogForCheckPlannedEventDataDefault,
  useContextDialogForCheckPlannedEventsForUX,
} from './dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import {
  ContextDialogForInsertNewPlannedEvent,
  contextDialogForInsertNewPlannedEventDataDefault,
  useContextDialogForInsertNewPlannedEventForUX,
} from './dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent.tsx'
import { DialogForInsertNewPlannedEvent } from './dialog-insert-new-planned-event/DialogForInsertNewPlannedEvent.tsx'

const UXContext = createContext<{
  dialogForInsertNewGoal: ContextDialogForInsertNewGoal
  dialogForSeeNotes: ContextDialogForSeeNotes
  dialogForGroover: ContextDialogForGroover
  dialogForCheckPlannedEvent: ContextDialogForCheckPlannedEvent
  dialogForInsertNewPlannedEvent: ContextDialogForInsertNewPlannedEvent
}>({
  dialogForInsertNewGoal: contextDialogForInsertNewGoalDataDefault,
  dialogForSeeNotes: contextDialogForSeeNotesDataDefault,
  dialogForGroover: contextDialogForGrooverDataDefault,
  dialogForCheckPlannedEvent: contextDialogForCheckPlannedEventDataDefault,
  dialogForInsertNewPlannedEvent:
    contextDialogForInsertNewPlannedEventDataDefault,
})

export const UXProvider: FC<PropsWithChildren> = props => {
  const { dialogForInsertNewGoal } = useContextDialogForInsertNewGoalForUX()
  const { dialogForSeeNotes } = useUXContextDialogForSeeNotesForUX()
  const { dialogForGroover } = useContextDialogForGrooverForUX()
  const { dialogForCheckPlannedEvent } =
    useContextDialogForCheckPlannedEventsForUX()
  const { dialogForInsertNewPlannedEvent } =
    useContextDialogForInsertNewPlannedEventForUX()

  return (
    <UXContext.Provider
      value={{
        dialogForInsertNewGoal,
        dialogForSeeNotes,
        dialogForGroover,
        dialogForCheckPlannedEvent,
        dialogForInsertNewPlannedEvent,
      }}
    >
      <DialogForInsertNewGoal />
      <DialogSeeNotes />
      <DialogForGroover />
      <DialogCheckPlannedEvent />
      <DialogForInsertNewPlannedEvent />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}
