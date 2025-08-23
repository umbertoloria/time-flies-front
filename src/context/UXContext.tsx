import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { DialogForInsertNewGoal } from './dialog-insert-new-goal/DialogForInsertNewGoal.tsx'
import { DialogForGroover } from './dialog-groover/DialogForGroover.tsx'
import { DialogCheckPlannedEvent } from './dialog-check-planned-events/DialogCheckPlannedEvent.tsx'
import {
  ContextDialogForInsertNewGoal,
  contextDialogForInsertNewGoalDataDefault,
  useContextDialogForInsertNewGoalForUX,
} from './dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import {
  ContextDialogForDatePanel,
  contextDialogForDatePanelDataDefault,
  useUXContextDialogForDatePanelForUX,
} from './date-panel/ContextDialogForDatePanel.tsx'
import {
  ContextDialogForGroover,
  contextDialogForGrooverDataDefault,
  useContextDialogForGrooverForUX,
} from './dialog-groover/ContextDialogForGroover.tsx'
import {
  ContextDialogForCheckPlannedEvent,
  contextDialogForCheckPlannedEventDataDefault,
  useContextDialogForCheckPlannedEventForUX,
} from './dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import {
  ContextDialogForInsertNewPlannedEvent,
  contextDialogForInsertNewPlannedEventDataDefault,
  useContextDialogForInsertNewPlannedEventForUX,
} from './dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent.tsx'
import { DialogForInsertNewPlannedEvent } from './dialog-insert-new-planned-event/DialogForInsertNewPlannedEvent.tsx'
import {
  ContextDialogForCalendarManagement,
  contextDialogForCalendarManagementDataDefault,
  useContextDialogForCalendarManagementForUX,
} from './dialog-calendar-management/ContextDialogForCalendarManagement.tsx'
import { DialogCalendarManagement } from './dialog-calendar-management/DialogCalendarManagement.tsx'

const UXContext = createContext<{
  dialogForInsertNewGoal: ContextDialogForInsertNewGoal
  dialogForDatePanel: ContextDialogForDatePanel
  dialogForGroover: ContextDialogForGroover
  dialogForCheckPlannedEvent: ContextDialogForCheckPlannedEvent
  dialogForInsertNewPlannedEvent: ContextDialogForInsertNewPlannedEvent
  dialogForCalendarManagement: ContextDialogForCalendarManagement
}>({
  dialogForInsertNewGoal: contextDialogForInsertNewGoalDataDefault,
  dialogForDatePanel: contextDialogForDatePanelDataDefault,
  dialogForGroover: contextDialogForGrooverDataDefault,
  dialogForCheckPlannedEvent: contextDialogForCheckPlannedEventDataDefault,
  dialogForInsertNewPlannedEvent:
    contextDialogForInsertNewPlannedEventDataDefault,
  dialogForCalendarManagement: contextDialogForCalendarManagementDataDefault,
})

export const UXProvider: FC<PropsWithChildren> = props => {
  const { dialogForInsertNewGoal } = useContextDialogForInsertNewGoalForUX()
  const { dialogForDatePanel } = useUXContextDialogForDatePanelForUX()
  const { dialogForGroover } = useContextDialogForGrooverForUX()
  const { dialogForCheckPlannedEvent } =
    useContextDialogForCheckPlannedEventForUX()
  const { dialogForInsertNewPlannedEvent } =
    useContextDialogForInsertNewPlannedEventForUX()
  const { dialogForCalendarManagement } =
    useContextDialogForCalendarManagementForUX()

  return (
    <UXContext.Provider
      value={{
        dialogForInsertNewGoal,
        dialogForDatePanel,
        dialogForGroover,
        dialogForCheckPlannedEvent,
        dialogForInsertNewPlannedEvent,
        dialogForCalendarManagement,
      }}
    >
      <DialogForInsertNewGoal />
      {/*<DialogDatePanel />*/}
      <DialogForGroover />
      <DialogCheckPlannedEvent />
      <DialogForInsertNewPlannedEvent />
      <DialogCalendarManagement />
      {props.children}
    </UXContext.Provider>
  )
}

export const useUXContext = () => {
  return useContext(UXContext)
}
