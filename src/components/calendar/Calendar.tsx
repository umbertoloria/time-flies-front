import { DayStatus } from './DayStatus'
import { TCalendar } from '../../remote/sdk/types'
import { datesInTheSameDay } from '../../lib/utils'
import { mapDataToCalendarLines, moveDateToWeekStart } from './utils'
import { FC } from 'react'

export const Calendar: FC<{
  startWeekFromDate: Date
  numWeeks: number
  calendar: TCalendar
}> = props => {
  const fromDateInitial = new Date(props.startWeekFromDate)
  const fromDateFloor = moveDateToWeekStart(fromDateInitial)

  const numDays = !datesInTheSameDay(fromDateInitial, fromDateFloor)
    ? (props.numWeeks + 1) * 7
    : props.numWeeks * 7

  const calendarLines = mapDataToCalendarLines(
    props.calendar,
    fromDateFloor,
    numDays
  )

  return (
    <CalendarStateless
      calendar={props.calendar}
      calendarLines={calendarLines}
      placeTableHeadWithWeekDays
    />
  )
}

export const CalendarStateless: FC<{
  calendar?: TCalendar
  calendarLines: CalendarLineProps[]
  placeTableHeadWithWeekDays?: boolean
}> = props => (
  <>
    {!!props.calendar && (
      <h1
        className='text-center text-lg font-semibold text-gray-700 bg-gray-500 rounded mb-2 py-0.5'
        style={{
          color: props.calendar.color || undefined,
        }}
      >
        {props.calendar.name}
      </h1>
    )}
    <table className='m-auto text-gray-700'>
      <tbody>
        {!!props.placeTableHeadWithWeekDays && <CalendarHead />}
        {props.calendarLines.map((calendarLine, index) => (
          <CalendarLine key={index} {...calendarLine} />
        ))}
      </tbody>
    </table>
  </>
)

const weekDays = [
  {
    name: 'monday',
    display: 'Lun',
  },
  {
    name: 'tuesday',
    display: 'Mar',
  },
  {
    name: 'wednesday',
    display: 'Mer',
  },
  {
    name: 'thursday',
    display: 'Gio',
  },
  {
    name: 'friday',
    display: 'Ven',
  },
  {
    name: 'saturday',
    display: 'Sab',
  },
  {
    name: 'sunday',
    display: 'Dom',
  },
]
const CalendarHead: FC = () => (
  <tr>
    {weekDays.map((day, index) => (
      <th className='m-0 p-0' key={index}>
        <span>{day.display}</span>
      </th>
    ))}
  </tr>
)

export type CalendarLineProps = {
  cells: CalendarCellProps[]
}
const CalendarLine: FC<CalendarLineProps> = props => (
  <tr>
    {props.cells.map((cell, index) => (
      <CalendarCell key={index} {...cell} />
    ))}
  </tr>
)

export type CalendarCellProps = {
  displayDate: string
  color: string
  done: boolean
  isToday: boolean
}
const CalendarCell: FC<CalendarCellProps> = props => (
  <td className='m-0 p-0'>
    <DayStatus
      checked={props.done}
      color={props.color}
      tooltip={props.displayDate}
      highlightToday={props.isToday}
    />
  </td>
)
