import { FC, PropsWithChildren, useEffect } from 'react'
import { TCalendar, TDay } from '../../remote/sdk/types'
import { getITMonthFromLocalDate } from '../../lib/utils'
import { DayStatus } from './DayStatus'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from './event-calendar-updated.ts'
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
        calendarLines={calendarLines}
        calendarData={{
          idForUpdate: props.calendar.id,
          color: props.calendar.color,
          name: props.calendar.name,
        }}
        placeTableHeadWithWeekDays
        pleaseUpdateCalendar={props.pleaseUpdateCalendar}
        goInThePast={props.goInThePast}
        goInTheFuture={props.goInTheFuture}
      />
    </>
  )
}

export const CalendarStateless: FC<{
  calendarLines: CalendarLineProps[]
  calendarData?: {
    idForUpdate?: number
    color: string
    name: string
  }
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
    const listener: CustomEventFnType<
      CustomEventTypeCalendarUpdated
    > = event => {
      const { calendarId } = event.detail
      if (
        props.pleaseUpdateCalendar &&
        props.calendarData?.idForUpdate &&
        calendarId === props.calendarData.idForUpdate
      ) {
        props.pleaseUpdateCalendar()
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])

  return (
    <div>
      {!!props.calendarData && !!props.goInThePast && !!props.goInTheFuture && (
        <>
          <CalendarTitle
            textColor={props.calendarData.color}
            label={props.calendarData.name}
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
  color?: string
  status: 'none' | 'planned' | 'done'
  day?: TDay
}
const CalendarCell: FC<CalendarCellProps> = props => (
  <td className='m-0 p-0'>
    <DayStatus
      day={props.day}
      status={
        props.status === 'planned' || props.status === 'done'
          ? props.status
          : undefined
      }
      color={props.color}
      tooltip={props.displayDate}
      apiData={{
        calendarId: props.calendarId,
        localDate: props.localDate,
      }}
    />
  </td>
)
