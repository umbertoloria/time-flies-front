import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { CalendarCellProps, CalendarStateless } from '../calendar/Calendar'
import {
  AllDaysElem,
  appendToAllDaysList,
  displayDateFromLocalDate,
  finalizeAllDaysList,
  getDateWithOffsetDays,
} from '../calendar/utils'
import {
  datesInTheSameDay,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils'

export function createCalendarCellPropsList(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar,
  nowDate: Date
): CalendarCellProps[] {
  // TODO: Improve this algorithm

  // Calculating cells
  let iDays = 0

  const cells: CalendarCellProps[] = []
  let iCell = numDaysBefore
  while (iCell >= 0) {
    const curDate = getDateWithOffsetDays(endDate, -iCell)
    const localDate = getLocalDayByDate(curDate)

    const isToday = datesInTheSameDay(curDate, nowDate)

    // All "TDays" to evaluate
    const allDays: AllDaysElem[] = []
    appendToAllDaysList(allDays, calendar)
    if (calendar.children && calendar.children.length) {
      for (const childCalendar of calendar.children) {
        appendToAllDaysList(allDays, childCalendar)
      }
    }
    finalizeAllDaysList(allDays)

    while (
      iDays < allDays.length &&
      localDatesLT(allDays[iDays].day.date, localDate)
    ) {
      ++iDays
    }

    if (iDays < allDays.length) {
      const day = allDays[iDays]

      if (day.day.date === localDate) {
        cells.push({
          localDate,
          calendarId: calendar.id,
          displayDate: displayDateFromLocalDate(localDate),
          color: day.color,
          status: day.isPlanned ? 'planned' : 'done',
          isToday,
        })
      } else {
        cells.push({
          localDate,
          calendarId: calendar.id,
          displayDate: displayDateFromLocalDate(localDate),
          // color: undefined,
          status: 'none',
          isToday,
        })
      }
    } else {
      cells.push({
        localDate,
        calendarId: calendar.id,
        displayDate: displayDateFromLocalDate(localDate),
        // color: undefined,
        status: 'none',
        isToday,
      })
    }

    --iCell
  }
  return cells
}

export const Timeline: FC<{
  endDate: Date
  numDaysBefore: number
  nowDate: Date
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
}> = props => {
  const calendarCells = createCalendarCellPropsList(
    props.endDate,
    props.numDaysBefore,
    props.calendar,
    props.nowDate
  )

  return (
    <>
      <CalendarStateless
        calendarLines={[{ cells: calendarCells }]}
        pleaseUpdateCalendar={props.pleaseUpdateCalendar}
      />
    </>
  )
}
