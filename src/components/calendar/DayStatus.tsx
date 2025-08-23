import { FC } from 'react'
import classNames from 'classnames'
import { useDialogForDatePanel } from '../../context/date-panel/ContextDialogForDatePanel.tsx'
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

  const onClick = (() => {
    if (props.onClick) {
      return () => {
        if (props.onClick) {
          props.onClick()
        }
      }
    }
    if (
      !!props.apiData &&
      // If a DayStatus is clickable for opening DatePanel.
      (props.status === 'done' ||
        props.status === 'planned' ||
        isInCurrWeek ||
        isFuture)
    ) {
      return () => {
        if (props.apiData) {
          // On Parent Calendar, this uses the Actual Calendar ID (Parent or
          // Child depending on the actual Date).
          openDialogForDatePanel({
            mode: 'calendar-date-panel',
            calendarId: props.apiData.calendar.id,
            date: props.date,
          })
        }
      }
    }
    return undefined
  })()

  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <div
      className='date-div'
      title={displayDateFromLocalDate(props.date)} // As tooltip.
    >
      <div
        className={classNames('rounded-sm w-full h-full', {
          'bg-gray-200': !props.color,
          clickable: !!onClick,
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
