import { FC } from 'react'
import classNames from 'classnames'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  getTodayDate,
  isLocalDateFuture,
  isLocalDateToday,
  localDatesLTE,
} from '../../lib/utils.ts'
import { displayDateFromLocalDate } from './utils.ts'

export type DayStatusProps = {
  date: string // Es. "2023-01-01"
  status?: 'planned' | 'done'
  color?: string
  apiData?: {
    calendar: {
      id: number
      usesNotes: boolean
    }
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
          openDialogForDatePanel({
            mode: 'calendar-date-panel',
            calendarId: props.apiData.calendar.id,
            date: props.date,
            allowNewDoneTasks: false,
            allowNewTodos: false,
          })
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-calendar-day') {
      return () => {
        if (props.apiData) {
          // On Parent Calendar, this uses the Actual Calendar ID (Parent or
          // Child depending on the actual Date).
          // It doesn't matter if "props.status" is "done" or "planned".
          openDialogForDatePanel({
            mode: 'calendar-date-panel',
            calendarId: props.apiData.calendar.id,
            date: props.date,
            allowNewDoneTasks: true,
            allowNewTodos: false,
          })
        } else {
          // Should never happen.
        }
      }
    }
    if (actionMode === 'create-new-planned-event') {
      return () => {
        if (!props.status && !!props.apiData) {
          // On Parent Calendar, this uses the Actual Calendar ID (Parent or
          // Child depending on the actual Date).
          openDialogForDatePanel({
            mode: 'calendar-date-panel',
            calendarId: props.apiData.calendar.id,
            date: props.date,
            allowNewDoneTasks: false,
            allowNewTodos: true,
          })
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

  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  const displayDate = displayDateFromLocalDate(props.date)

  return (
    <div
      className='date-div'
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
