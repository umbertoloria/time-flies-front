import { FC, PropsWithChildren, useEffect } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { getITMonthFromLocalDate } from '../../lib/utils'
import { DayStatus } from './DayStatus'
import {
  CalendarUpdatedEventFnType,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '../../events/calendar-events.ts'
import {
  getFirstAndLastLocalDatesFromCalendarLines,
  mapDataToCalendarLines,
  moveDateToWeekStart,
} from './utils'

export const Calendar: FC<{
  startWeekFromDate: Date
  numWeeks: number
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
  goInThePast: () => void
  goInTheFuture: () => void
}> = props => {
  const calendarLines = mapDataToCalendarLines(
    props.calendar,
    moveDateToWeekStart(props.startWeekFromDate),
    props.numWeeks
  )

  return (
    <>
      <CalendarStateless
        calendar={props.calendar}
        calendarLines={calendarLines}
        placeTableHeadWithWeekDays
        pleaseUpdateCalendar={props.pleaseUpdateCalendar}
        goInThePast={props.goInThePast}
        goInTheFuture={props.goInTheFuture}
      />
    </>
  )
}

export const CalendarStateless: FC<{
  calendar?: TCalendar
  calendarLines: CalendarLineProps[]
  placeTableHeadWithWeekDays?: boolean
  pleaseUpdateCalendar: () => void
  goInThePast?: () => void
  goInTheFuture?: () => void
}> = props => {
  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromCalendarLines(props.calendarLines)
  const firstMonthLang = getITMonthFromLocalDate(firstLocalDate)
  const lastMonthLang = getITMonthFromLocalDate(lastLocalDate)

  useEffect(() => {
    const listener: CalendarUpdatedEventFnType = event => {
      const { calendarId } = event.detail
      if (props.calendar && props.pleaseUpdateCalendar) {
        if (calendarId === props.calendar.id) {
          props.pleaseUpdateCalendar()
        }
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])

  return (
    <div>
      {!!props.calendar && !!props.goInThePast && !!props.goInTheFuture && (
        <>
          <CalendarTitle
            textColor={props.calendar.color}
            label={props.calendar.name}
          >
            <CalendarArrowControl
              firstMonthLang={firstMonthLang}
              lastMonthLang={lastMonthLang}
              goInThePast={props.goInThePast}
              goInTheFuture={props.goInTheFuture}
            />
          </CalendarTitle>
        </>
      )}
      <table className='m-auto text-gray-700'>
        <tbody>
          {!!props.placeTableHeadWithWeekDays && <CalendarHead />}
          {props.calendarLines.map((calendarLine, index) => (
            <CalendarLine key={index} {...calendarLine} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const CalendarTitle: FC<
  PropsWithChildren<{
    textColor?: string
    label: string
  }>
> = props => (
  <div className='bg-gray-500 rounded mb-2 mx-auto px-2.5 py-1.5 max-w-96 flex flex-wrap items-center justify-between'>
    <h1
      className='text-lg font-semibold text-gray-700'
      style={{
        color: props.textColor || undefined,
      }}
    >
      {props.label}
    </h1>
    {props.children}
  </div>
)

export const CalendarArrowControl: FC<{
  firstMonthLang: string
  lastMonthLang: string
  goInThePast: () => void
  goInTheFuture: () => void
}> = ({ firstMonthLang, lastMonthLang, goInThePast, goInTheFuture }) => {
  return (
    <div className='flex flex-wrap gap-3 bg-gray-400 p-1 rounded-full w-fit'>
      <CalendarTimeTravelButton label='<' onClick={goInThePast} />
      <div className='text-center min-w-20'>
        {firstMonthLang}
        {'-'}
        {lastMonthLang}
      </div>
      <CalendarTimeTravelButton label='>' onClick={goInTheFuture} />
    </div>
  )
}

const CalendarTimeTravelButton: FC<{
  label: string
  onClick: () => void
}> = props => (
  <button
    className='rounded-full bg-white w-6 h-6 text-center font-bold'
    onClick={props.onClick}
  >
    {props.label}
  </button>
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
  localDate: string
  calendarId: number
  displayDate: string
  color: string
  status: 'none' | 'planned' | 'done'
  isToday: boolean
}
const CalendarCell: FC<CalendarCellProps> = props => (
  <td className='m-0 p-0'>
    <DayStatus
      status={
        props.status === 'planned' || props.status === 'done'
          ? props.status
          : undefined
      }
      color={props.color}
      tooltip={props.displayDate}
      highlightToday={props.isToday}
      apiData={{
        calendarId: props.calendarId,
        localDate: props.localDate,
      }}
    />
  </td>
)
