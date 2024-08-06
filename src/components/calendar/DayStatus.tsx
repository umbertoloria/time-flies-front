import { FC } from 'react'
import classNames from 'classnames'

export const DayStatus: FC<{
  status?: 'planned' | 'done'
  color: string
  plannedColor: string
  tooltip?: string
  highlightToday?: boolean
}> = props => (
  <div className='w-10 h-9 p-1' title={props.tooltip || undefined}>
    <div
      className={classNames('rounded-sm w-full h-full', {
        'day-status-today': props.highlightToday,
        'bg-gray-200': !props.status,
      })}
      style={{
        background:
          props.status === 'done'
            ? props.color
            : props.status === 'planned'
              ? props.plannedColor
              : undefined,
      }}
    />
  </div>
)
