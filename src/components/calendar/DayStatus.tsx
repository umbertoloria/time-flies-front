import { FC } from 'react'
import classNames from 'classnames'
import { useDialogForInsertNewGoal } from '../../context/dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import { useDialogForCalendarDateManagement } from '../../context/dialog-see-notes/ContextDialogForCalendarDateManagement.tsx'
import {
  isLocalDateFuture,
  isLocalDateToday,
  isLocalDateYesterday,
} from '../../lib/utils.ts'
import { displayDateFromLocalDate } from './utils.ts'
import { useDialogForInsertNewPlannedEvent } from '../../context/dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent.tsx'

export type DayStatusDayData = {
  date: string // Es. "2023-01-01"
  notes?: string
}
export type DayStatusProps = {
  dayData: DayStatusDayData
  status?: 'planned' | 'done'
  color?: string
  apiData?: {
    calendarId: number
  }
  onClick?: () => void
  // For now, "onClick" is used by the "Calendar Simulator" in Schedule page
}
export const DayStatus: FC<DayStatusProps> = props => {
  const isToday = isLocalDateToday(props.dayData.date)
  const isYesterday = isLocalDateYesterday(props.dayData.date)
  const isFuture = isLocalDateFuture(props.dayData.date)

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
    if ((isYesterday || isToday) && !!props.apiData) {
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
          openDialogForCalendarDateManagement({
            calendarId: props.apiData.calendarId,
            date: props.dayData.date,
            notes: props.dayData.notes || undefined,
          })
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-calendar-day') {
      return () => {
        if (props.apiData) {
          openDialogForInsertNewGoal(
            props.apiData.calendarId,
            props.dayData.date
          )
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-planned-event') {
      return () => {
        if (!props.status && !!props.apiData) {
          openDialogForInsertPlannedEvent(
            props.apiData.calendarId,
            props.dayData.date
          )
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

  const displayDate = displayDateFromLocalDate(props.dayData.date)

  return (
    <div
      className='w-10 h-9 p-1'
      title={displayDate} // As tooltip.
    >
      <div
        className={classNames('rounded-sm w-full h-full', {
          'bg-gray-200': !props.color,
          clickable: actionMode !== 'none',
          highlight:
            actionMode === 'custom-action' ||
            actionMode === 'create-new-calendar-day' ||
            actionMode === 'create-new-planned-event' ||
            !!props.dayData.notes,
          'highlight-with-border-inside':
            actionMode === 'custom-action' ||
            (actionMode === 'manage-calendar-date' && !!props.dayData.notes) ||
            actionMode === 'create-new-calendar-day',
          'day-status-has-notes': !!props.dayData.notes,
        })}
        style={{
          background: props.color || undefined,
        }}
        onClick={onClick}
      />
    </div>
  )
}
