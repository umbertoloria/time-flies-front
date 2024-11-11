import { FC } from 'react'
import classNames from 'classnames'
import {
  useUXDialogForInsertNewGoal,
  useUXDialogForSeeNotes,
} from '../../context/UXContext.tsx'
import { TDay } from '../../remote/sdk/types'
import { isLocalDateToday } from '../../lib/utils.ts'

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

  const { openDialog: openDialogForInsertNewGoal } =
    useUXDialogForInsertNewGoal()
  const { openDialog: openDialogForSeeNotes } = useUXDialogForSeeNotes()

  return (
    <div className='w-10 h-9 p-1' title={props.tooltip || undefined}>
      <div
        className={classNames('rounded-sm w-full h-full', {
          'bg-gray-200': !props.status,
          'day-status-today': isToday || typeof props.day?.notes === 'string',
          clickable:
            (props.status !== 'done' && isToday) ||
            typeof props.day?.notes === 'string',
        })}
        style={{
          background: props.color || undefined,
        }}
        onClick={() => {
          if (props.status !== 'done' && isToday) {
            openDialogForInsertNewGoal(
              props.apiData.calendarId,
              props.apiData.localDate
            )
          } else if (typeof props.day?.notes === 'string') {
            openDialogForSeeNotes(props.day?.notes)
          }
        }}
      />
    </div>
  )
}
