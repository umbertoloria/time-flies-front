import { FC } from 'react'
import classNames from 'classnames'

export const DayStatus: FC<{
  checked?: boolean
  color: string
  tooltip?: string
  highlightToday?: boolean
}> = props => (
  <div className='w-10 h-9 p-1' title={props.tooltip || undefined}>
    <div
      className={classNames('rounded-sm w-full h-full', {
        'day-status-today': props.highlightToday,
        'bg-green-300': props.checked && !!props.color,
        'bg-gray-200': !props.checked,
      })}
      style={{
        background: props.checked && !!props.color ? props.color : undefined,
      }}
    />
  </div>
)
