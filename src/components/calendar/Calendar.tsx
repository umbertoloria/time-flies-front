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
import { LogicCalendar } from './logic-calendar.ts'

function makeDayStatusRowsFromLogicCalendar(
  logicCalendar: LogicCalendar,
  fromDate: Date,
  weeksToShow: number
): DayStatusRow[] {
  // Requirement: "fromDate" *MUST* be a Monday.

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

  // From "logicDays", skipping all days that are before "fromLocalDate"
  const fromLocalDate = getLocalDayByDate(fromDate)
  let iNextCalendarDay = 0
  let curCalendarDay =
    iNextCalendarDay < logicDays.length
      ? logicDays[iNextCalendarDay++]
      : undefined

  while (
    !!curCalendarDay &&
    iNextCalendarDay < logicDays.length &&
    !localDatesLTE(fromLocalDate, curCalendarDay.dayData.date)
  ) {
    curCalendarDay = logicDays[iNextCalendarDay++]
  }

  // Filling "dayStatusRows"
  let dayOffset = 0
  const daysToShow = weeksToShow * 7
  while (dayOffset < daysToShow) {
    const curDate = getDateWithOffsetDays(fromDate, dayOffset)
    const curLocalDate = getLocalDayByDate(curDate)

    let color: undefined | string = undefined
    let status: 'planned' | 'done' | undefined = undefined
    let dayData: DayStatusDayData = {
      // "Fake"
      date: curLocalDate,
      notes: undefined,
    }
    let onClick: undefined | (() => void) = undefined

    if (!!curCalendarDay && iNextCalendarDay - 1 < logicDays.length) {
      if (curLocalDate === curCalendarDay.dayData.date) {
        color = curCalendarDay.color

        // Is it Done or Just Planned?
        if (curCalendarDay.isPlanned) {
          status = 'planned'
        } else {
          status = 'done'
        }

        dayData = curCalendarDay.dayData
        onClick = curCalendarDay.onClick
        curCalendarDay = logicDays[iNextCalendarDay++]
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

    ++dayOffset
  }

  return dayStatusRows
}

export const defaultNumWeeks = 4 * 3 // Three months
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
