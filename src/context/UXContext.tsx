'use client'

import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { DialogForInsertNewGoal } from '@/context/dialog-insert-new-goal/DialogForInsertNewGoal'
import { DialogForGroover } from '@/context/dialog-groover/DialogForGroover'
import { DialogCheckPlannedEvent } from '@/context/dialog-check-planned-events/DialogCheckPlannedEvent'
import {
  ContextDialogForInsertNewGoal,
  contextDialogForInsertNewGoalDataDefault,
  useContextDialogForInsertNewGoalForUX,
} from '@/context/dialog-insert-new-goal/ContextDialogForInsertNewGoal'
import {
  ContextDialogForDatePanel,
  contextDialogForDatePanelDataDefault,
  useUXContextDialogForDatePanelForUX,
} from '@/context/date-panel/ContextDialogForDatePanel'
import {
  ContextDialogForGroover,
  contextDialogForGrooverDataDefault,
  useContextDialogForGrooverForUX,
} from '@/context/dialog-groover/ContextDialogForGroover'
import {
  ContextDialogForCheckPlannedEvent,
  contextDialogForCheckPlannedEventDataDefault,
  useContextDialogForCheckPlannedEventForUX,
} from '@/context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents'
import {
  ContextDialogForInsertNewPlannedEvent,
  contextDialogForInsertNewPlannedEventDataDefault,
  useContextDialogForInsertNewPlannedEventForUX,
} from '@/context/dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent'
import { DialogForInsertNewPlannedEvent } from '@/context/dialog-insert-new-planned-event/DialogForInsertNewPlannedEvent'
import {
  ContextDialogForCalendarManagement,
  contextDialogForCalendarManagementDataDefault,
  useContextDialogForCalendarManagementForUX,
} from '@/context/dialog-calendar-management/ContextDialogForCalendarManagement'
import { DialogCalendarManagement } from '@/context/dialog-calendar-management/DialogCalendarManagement'

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
