import { FC } from 'react'
import classNames from 'classnames'
import {
  useUXDialogForInsertNewGoal,
  useUXDialogForSeeNotes,
} from '../../context/UXContext.tsx'
import { TDay } from '../../remote/sdk/types'
import { isLocalDateToday, isLocalDateYesterday } from '../../lib/utils.ts'

export const DayStatus: FC<{
  day?: TDay
  status?: 'planned' | 'done'
  color?: string
  tooltip?: string
  apiData: {
    calendarId: number
    localDate: string
  }
}> = props => {
  const isToday = isLocalDateToday(props.apiData.localDate)
  const isYesterday = isLocalDateYesterday(props.apiData.localDate)

  const canSetAsChecked = props.status !== 'done' && (isYesterday || isToday)
  const hasNotes = typeof props.day?.notes === 'string'

  const isClickable = canSetAsChecked || hasNotes

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
          if (canSetAsChecked) {
            openDialogForInsertNewGoal(
              props.apiData.calendarId,
              props.apiData.localDate
            )
          } else if (hasNotes && !!props.day?.notes) {
            openDialogForSeeNotes(props.day.notes)
          }
        }}
      />
    </div>
  )
}
