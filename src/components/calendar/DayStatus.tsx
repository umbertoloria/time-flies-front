import { FC } from 'react'
import classNames from 'classnames'
import { useUXInputDialogControls } from '../../context/UXContext.tsx'

export const DayStatus: FC<{
  status?: 'planned' | 'done'
  color: string
  plannedColor: string
  tooltip?: string
  highlightToday?: boolean
  apiData: {
    calendarId: number
    localDate: string
  }
}> = props => {
  const { openInputDialog } = useUXInputDialogControls()

  return (
    <div className='w-10 h-9 p-1' title={props.tooltip || undefined}>
      <div
        className={classNames('rounded-sm w-full h-full', {
          'bg-gray-200': !props.status,
          'day-status-today': props.highlightToday,
          clickable: props.status !== 'done' && props.highlightToday,
        })}
        style={{
          background:
            props.status === 'done'
              ? props.color
              : props.status === 'planned'
                ? props.plannedColor
                : undefined,
        }}
        onClick={() => {
          if (props.status !== 'done') {
            if (props.highlightToday) {
              openInputDialog(props.apiData.calendarId, props.apiData.localDate)
            }
          }
        }}
      />
    </div>
  )
}
