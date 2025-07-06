import { FC } from 'react'
import classNames from 'classnames'
import { useDialogForInsertNewGoal } from '../../context/dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import { useDialogForCalendarDateManagement } from '../../context/dialog-see-notes/ContextDialogForCalendarDateManagement.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  getTodayDate,
  isLocalDateFuture,
  isLocalDateToday,
  localDatesLTE,
} from '../../lib/utils.ts'
import { displayDateFromLocalDate } from './utils.ts'
import { useDialogForInsertNewPlannedEvent } from '../../context/dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent.tsx'

export type DayStatusProps = {
  date: string // Es. "2023-01-01"
  status?: 'planned' | 'done'
  color?: string
  apiData?: {
    calendarId: number
  }
  onClick?: () => void
  // For now, "onClick" is used by the "Calendar Simulator" in Schedule page
}
export const DayStatus: FC<DayStatusProps> = props => {
  const todayDate = getTodayDate()
  const lastWeek = getLocalDayByDate(getDateWithOffsetDays(todayDate, -7))
  const isInCurrWeek =
    localDatesLTE(lastWeek, props.date) &&
    localDatesLTE(props.date, getLocalDayByDate(todayDate))
  const isToday = isLocalDateToday(props.date)
  const isFuture = isLocalDateFuture(props.date)

  const actionMode:
    | 'custom-action'
    | 'manage-calendar-date'
    | 'create-new-calendar-day'
    | 'create-new-planned-event'
    | 'none' = (() => {
    if (props.onClick) {
      return 'custom-action'
    }
    if (props.status === 'done' && !!props.apiData) {
      return 'manage-calendar-date'
    }
    if (isInCurrWeek && !!props.apiData) {
      return 'create-new-calendar-day'
    }
    if (isFuture && !props.status && !!props.apiData) {
      return 'create-new-planned-event'
    }
    return 'none'
  })()

  const onClick = (() => {
    if (actionMode === 'custom-action') {
      return () => {
        if (props.onClick) {
          props.onClick()
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'manage-calendar-date') {
      return () => {
        if (props.status === 'done' && !!props.apiData) {
          // On Parent Calendar, this uses the Actual Calendar ID (Parent or
          // Child depending on the actual Date).
          openDialogForCalendarDateManagement({
            calendarId: props.apiData.calendarId,
            date: props.date,
          })
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-calendar-day') {
      return () => {
        if (props.apiData) {
          // On Parent Calendar, this uses Parent Calendar ID.
          openDialogForInsertNewGoal(props.apiData.calendarId, props.date)
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-planned-event') {
      return () => {
        if (!props.status && !!props.apiData) {
          // On Parent Calendar, this uses Parent Calendar ID.
          openDialogForInsertPlannedEvent(props.apiData.calendarId, props.date)
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode !== 'none') {
      // Should never happen.
    }
    return undefined
  })()

  const { openDialog: openDialogForInsertNewGoal } = useDialogForInsertNewGoal()
  const { openDialog: openDialogForCalendarDateManagement } =
    useDialogForCalendarDateManagement()
  const { openDialog: openDialogForInsertPlannedEvent } =
    useDialogForInsertNewPlannedEvent()

  const displayDate = displayDateFromLocalDate(props.date)

  return (
    <div
      className='w-10 h-9 p-1'
      title={displayDate} // As tooltip.
    >
      <div
        className={classNames('rounded-sm w-full h-full', {
          'bg-gray-200': !props.color,
          clickable: actionMode !== 'none',
          'show-today': isToday,
        })}
        style={{
          background: props.color || undefined,
        }}
        onClick={onClick}
      />
    </div>
  )
}
