import { FC, PropsWithChildren, useEffect } from 'react'
import {
  getDateWithOffsetDays,
  getITMonthFromLocalDate,
  getLocalDayByDate,
  localDatesLTE,
} from '../../lib/utils'
import { DayStatus, DayStatusDayData, DayStatusProps } from './DayStatus'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from './event-calendar-updated.ts'
import {
  getFirstAndLastLocalDatesFromDayStatusRows,
  moveDateToWeekStart,
} from './utils'
import {
  createLogicCalendarFromTCalendar,
  LogicCalendar,
} from './logic-calendar.ts'
import { TCalendar } from '../../remote/sdk/types'

function makeDayStatusRowsFromLogicCalendar(
  logicCalendar: LogicCalendar,
  fromDate: Date,
  weeksToShow: number
): DayStatusRow[] {
  // Requirements:
  // 1. Logic Days must be sorted in Date
  // 2. "fromDate" must be a Monday

  const fillingCellsCount = 7 as const // 7 days per week.

  const dayStatusRows: DayStatusRow[] = []
  const appendCell = (dayStatusProps: DayStatusProps) => {
    if (dayStatusRows.length === 0) {
      dayStatusRows.push({
        dayStatuses: [],
      })
    }
    let cells = dayStatusRows[dayStatusRows.length - 1].dayStatuses
    if (cells.length === fillingCellsCount) {
      dayStatusRows.push({
        dayStatuses: [],
      })
      cells = dayStatusRows[dayStatusRows.length - 1].dayStatuses
    }
    cells.push(dayStatusProps)
  }
  const { logicDays } = logicCalendar

  let iNextCalendarDay = 0
  let curLogicDay =
    iNextCalendarDay < logicDays.length
      ? logicDays[iNextCalendarDay++]
      : undefined

  // From "logicDays", skipping all days that are before "fromDate"
  const fromLocalDate = getLocalDayByDate(fromDate)
  while (
    !!curLogicDay &&
    iNextCalendarDay < logicDays.length &&
    !localDatesLTE(fromLocalDate, curLogicDay.dayData.date)
  ) {
    curLogicDay = logicDays[iNextCalendarDay++]
  }
  // From now on, "curLogicDay" will always be from "fromDate" to the future
  // (or NULL if there aren't).

  // Filling "dayStatusRows"
  const daysToShow = weeksToShow * 7
  for (let dayOffset = 0; dayOffset < daysToShow; ++dayOffset) {
    const curDate = getDateWithOffsetDays(fromDate, dayOffset)
    const curLocalDate = getLocalDayByDate(curDate)

    let color: undefined | string = undefined
    let status: 'planned' | 'done' | undefined = undefined
    let dayData: DayStatusDayData = {
      // "Empty day"
      date: curLocalDate,
      notes: undefined,
    }
    let onClick: undefined | (() => void) = undefined

    if (!!curLogicDay && curLogicDay.dayData.date === curLocalDate) {
      color = curLogicDay.color

      // Is it Done or Just Planned?
      if (curLogicDay.isPlanned) {
        status = 'planned'
      } else {
        status = 'done'
      }

      dayData = curLogicDay.dayData
      onClick = curLogicDay.onClick

      // Going to the next Calendar Day (if there exist).
      if (iNextCalendarDay < logicDays.length) {
        curLogicDay = logicDays[iNextCalendarDay++]

        if (curLogicDay.dayData.date === curLocalDate) {
          // TODO: Multiple days in various Calendars (Parent and Children)
          const prevCalendarDay = logicDays[iNextCalendarDay - 2]
          console.log(
            'Found multiple Calendar Days on the same date',
            curLocalDate,
            prevCalendarDay,
            curLogicDay
          )

          // Let's go in the future until we find:
          // 1. a dead end, so no future Calendar Days left
          // 2. a future Calendar Days
          while (
            curLogicDay.dayData.date === curLocalDate &&
            iNextCalendarDay < logicDays.length
          ) {
            curLogicDay = logicDays[iNextCalendarDay++]
          }
          if (iNextCalendarDay < logicDays.length) {
            // Fine. We jump the group of multiple Calendar Days that were on
            // the same date. Now we can go to the next iteration.
          } else {
            // This means case 1: there are no Calendar Days left, and the
            // "current" is still one of the multiple Calendar Days on the same
            // date.
            curLogicDay = undefined
          }
        }
      } else {
        // No problem. This means there are no more Calendar Days to process.
        curLogicDay = undefined
      }
    }

    appendCell({
      dayData,
      apiData: logicCalendar.apiCalendar
        ? {
            calendarId: logicCalendar.apiCalendar.id,
          }
        : undefined,
      color: color || undefined,
      status,
      onClick,
    })
  }

  return dayStatusRows
}

export const CalendarFromCalendar: FC<{
  calendar: TCalendar
  startWeekFromDate: Date
  numWeeks: number
  pleaseUpdateCalendar: () => void
  goInThePast: () => void
  goInTheFuture: () => void
}> = props => {
  return (
    <CalendarForLogicCalendar
      startWeekFromDate={props.startWeekFromDate}
      numWeeks={props.numWeeks}
      logicCalendar={createLogicCalendarFromTCalendar(props.calendar)}
      pleaseUpdateCalendar={props.pleaseUpdateCalendar}
      goInThePast={props.goInThePast}
      goInTheFuture={props.goInTheFuture}
    />
  )
}

export const CalendarForLogicCalendar: FC<{
  startWeekFromDate: Date
  numWeeks: number
  logicCalendar: LogicCalendar
  pleaseUpdateCalendar: () => void
  goInThePast: () => void
  goInTheFuture: () => void
}> = props => {
  return (
    <CalendarStateless
      dayStatusRows={makeDayStatusRowsFromLogicCalendar(
        props.logicCalendar,
        moveDateToWeekStart(props.startWeekFromDate),
        props.numWeeks
      )}
      calendarData={{
        idForUpdate: props.logicCalendar.apiCalendar?.id,
        color: props.logicCalendar.color,
        name: props.logicCalendar.name,
      }}
      placeTableHeadWithWeekDays
      pleaseUpdateCalendar={props.pleaseUpdateCalendar}
      goInThePast={props.goInThePast}
      goInTheFuture={props.goInTheFuture}
    />
  )
}

export type CalendarDataProps = {
  idForUpdate?: number
  color: string
  name: string
}
export const CalendarStateless: FC<{
  dayStatusRows: DayStatusRow[]
  calendarData?: CalendarDataProps
  placeTableHeadWithWeekDays?: boolean
  pleaseUpdateCalendar: () => void
  goInThePast?: () => void
  goInTheFuture?: () => void
}> = props => {
  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromDayStatusRows(props.dayStatusRows)
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
          {props.dayStatusRows.map((dayStatusRow, index) => (
            <tr key={index}>
              {dayStatusRow.dayStatuses.map((cell, index) => (
                <td key={index} className='m-0 p-0'>
                  <DayStatus {...cell} />
                </td>
              ))}
            </tr>
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

export type DayStatusRow = {
  dayStatuses: DayStatusProps[]
}
