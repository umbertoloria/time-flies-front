import { FC } from 'react'
import classNames from 'classnames'
import { useDialogForInsertNewGoal } from '../../context/dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import { useDialogForSeeNotes } from '../../context/dialog-see-notes/ContextDialogForSeeNotes.tsx'
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
    | 'none'
    | 'custom-action'
    | 'create-new-calendar-day'
    | 'create-new-planned-event'
    | 'show-notes' = (() => {
    if (props.onClick) {
      return 'custom-action'
    }
    if (typeof props.dayData?.notes === 'string') {
      return 'show-notes'
    }
    if (props.status !== 'done') {
      if ((isYesterday || isToday) && !!props.apiData) {
        return 'create-new-calendar-day'
      }
      if (isFuture && !props.status) {
        return 'create-new-planned-event'
      }
    }
    return 'none'
  })()

  const onClick = (() => {
    if (actionMode === 'custom-action' && props.onClick) {
      return () => {
        if (props.onClick) {
          props.onClick()
        } else {
          // Should never happen.
        }
      }
    }
    if (
      actionMode === 'show-notes' &&
      typeof props.dayData?.notes === 'string'
    ) {
      return () => {
        if (typeof props.dayData?.notes === 'string') {
          openDialogForSeeNotes(props.dayData.notes)
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-calendar-day' && props.apiData) {
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
    if (actionMode === 'create-new-planned-event' && props.apiData) {
      return () => {
        if (props.apiData) {
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
  const { openDialog: openDialogForSeeNotes } = useDialogForSeeNotes()
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
          'has-border-inside':
            actionMode !== 'none' && actionMode !== 'create-new-planned-event',
          'day-status-has-notes': actionMode === 'show-notes',
        })}
        style={{
          background: props.color || undefined,
        }}
        onClick={onClick}
      />
    </div>
  )
}
