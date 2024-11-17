import { FC } from 'react'
import classNames from 'classnames'
import {
  useUXDialogForInsertNewGoal,
  useUXDialogForSeeNotes,
} from '../../context/UXContext.tsx'
import { isLocalDateToday, isLocalDateYesterday } from '../../lib/utils.ts'

export type DayStatusDayData = {
  date: string // Es. "2023-01-01"
  notes?: string
}
export const DayStatus: FC<{
  dayData: DayStatusDayData
  status?: 'planned' | 'done'
  color?: string
  tooltip?: string
  apiData?: {
    calendarId: number
  }
  onClick?: () => void
}> = props => {
  const isToday = isLocalDateToday(props.dayData.date)
  const isYesterday = isLocalDateYesterday(props.dayData.date)

  const canSetAsChecked =
    props.status !== 'done' && (isYesterday || isToday) && props.apiData
  const hasNotes = typeof props.dayData?.notes === 'string'

  const isClickable = props.onClick || canSetAsChecked || hasNotes

  const { openDialog: openDialogForInsertNewGoal } =
    useUXDialogForInsertNewGoal()
  const { openDialog: openDialogForSeeNotes } = useUXDialogForSeeNotes()

  return (
    <div className='w-10 h-9 p-1' title={props.tooltip || undefined}>
      <div
        className={classNames('rounded-sm w-full h-full', {
          'bg-gray-200': !props.color && !isClickable,
          'bg-gray-300': !props.color && isClickable,
          clickable: isClickable,
          'day-status-has-notes': hasNotes,
          // 'day-status-yesterday': isYesterday,
          // 'day-status-today': isToday,
        })}
        style={{
          background: props.color || undefined,
        }}
        onClick={() => {
          if (props.onClick) {
            props.onClick()
          } else if (canSetAsChecked && props.apiData) {
            openDialogForInsertNewGoal(
              props.apiData.calendarId,
              props.dayData.date
            )
          } else if (hasNotes && !!props.dayData?.notes) {
            openDialogForSeeNotes(props.dayData.notes)
          }
        }}
      />
    </div>
  )
}
