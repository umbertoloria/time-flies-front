import { FC, PropsWithChildren, useEffect } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import {
  getDateWithOffsetDays,
  getITMonthFromLocalDate,
  getLocalDayByDate,
  localDatesLTE,
} from '../../lib/utils'
import { DayStatus, DayStatusDayData } from './DayStatus'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from './event-calendar-updated.ts'
import {
  AllDaysElem,
  appendToAllDaysList,
  displayDateFromLocalDate,
  finalizeAllDaysList,
  getFirstAndLastLocalDatesFromCalendarLines,
  moveDateToWeekStart,
} from './utils'

function makeCalendarLinesAndDataFromCalendar(
  calendar: TCalendar,
  fromDate: Date,
  weeksToShow: number
): {
  calendarLines: CalendarLineProps[]
  calendarData: CalendarDataProps
} {
  // Requirement: "fromDate" *MUST* be a Monday.

  const fillingCellsCount = 7 as const // 7 days per week.

  const calendarLines: CalendarLineProps[] = []
  const calendarData: CalendarDataProps = {
    idForUpdate: calendar.id,
    color: calendar.color,
    name: calendar.name,
  }

  function appendCell(cellToAdd: CalendarCellProps) {
    if (calendarLines.length === 0) {
      calendarLines.push({
        cells: [],
      })
    }
    let cells = calendarLines[calendarLines.length - 1].cells
    if (cells.length === fillingCellsCount) {
      calendarLines.push({
        cells: [],
      })
      cells = calendarLines[calendarLines.length - 1].cells
    }
    cells.push(cellToAdd)
  }

  // All "TDays" to evaluate
  const allDays: AllDaysElem[] = []
  appendToAllDaysList(allDays, calendar)
  if (calendar.children && calendar.children.length) {
    for (const childCalendar of calendar.children) {
      appendToAllDaysList(allDays, childCalendar)
    }
  }
  finalizeAllDaysList(allDays)

  if (allDays.length === 0) {
    // Given no dates.
    return { calendarLines, calendarData }
  }

  // From "allDays", skipping all days that are before "fromLocalDate"
  const fromLocalDate = getLocalDayByDate(fromDate)
  let iNextCalendarDay = 0
  let curCalendarDay =
    iNextCalendarDay < allDays.length ? allDays[iNextCalendarDay++] : undefined

  while (
    !!curCalendarDay &&
    iNextCalendarDay < allDays.length &&
    !localDatesLTE(fromLocalDate, curCalendarDay.dayData.date)
  ) {
    curCalendarDay = allDays[iNextCalendarDay++]
  }

  // Filling "calendarLines"
  let dayOffset = 0
  const daysToShow = weeksToShow * 7
  while (dayOffset < daysToShow) {
    const curDate = getDateWithOffsetDays(fromDate, dayOffset)
    const curLocalDate = getLocalDayByDate(curDate)

    let color: undefined | string = undefined
    let status: 'planned' | 'done' | 'none' = 'none'
    let dayData: undefined | DayStatusDayData = undefined

    if (!!curCalendarDay && iNextCalendarDay - 1 < allDays.length) {
      if (curLocalDate === curCalendarDay.dayData.date) {
        color = curCalendarDay.color

        // Is it Done or Just Planned?
        if (curCalendarDay.isPlanned) {
          status = 'planned'
        } else {
          status = 'done'
        }

        dayData = curCalendarDay.dayData
        curCalendarDay = allDays[iNextCalendarDay++]
      }
    }

    appendCell({
      localDate: curLocalDate,
      calendarId: calendar.id,
      displayDate: displayDateFromLocalDate(curLocalDate),
      color: color || undefined,
      status,
      dayData,
    })

    ++dayOffset
  }

  return { calendarLines, calendarData }
}

export const Calendar: FC<{
  startWeekFromDate: Date
  numWeeks: number
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
  goInThePast: () => void
  goInTheFuture: () => void
}> = props => {
  const { calendarLines, calendarData } = makeCalendarLinesAndDataFromCalendar(
    props.calendar,
    moveDateToWeekStart(props.startWeekFromDate),
    props.numWeeks
  )

  return (
    <>
      <CalendarStateless
        calendarLines={calendarLines}
        calendarData={calendarData}
        placeTableHeadWithWeekDays
        pleaseUpdateCalendar={props.pleaseUpdateCalendar}
        goInThePast={props.goInThePast}
        goInTheFuture={props.goInTheFuture}
      />
    </>
  )
}

export type CalendarDataProps = {
  idForUpdate?: number
  color: string
  name: string
}
export const CalendarStateless: FC<{
  calendarLines: CalendarLineProps[]
  calendarData?: CalendarDataProps
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
  dayData?: DayStatusDayData
}
const CalendarCell: FC<CalendarCellProps> = props => (
  <td className='m-0 p-0'>
    <DayStatus
      dayData={props.dayData}
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
