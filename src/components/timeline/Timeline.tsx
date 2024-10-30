import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { CalendarCellProps, CalendarStateless } from '../calendar/Calendar'
import {
  CalDayInternal,
  displayDateFromLocalDate,
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
  nowDate: Date,
  color: string,
  plannedColor: string
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
    const allDays: CalDayInternal[] = []
    // ...from "main" calendar
    allDays.push(
      ...calendar.days.map(day => ({
        day,
        color,
        plannedColor,
      }))
    )
    if (calendar.plannedDays && calendar.plannedDays.length) {
      allDays.push(
        ...calendar.plannedDays.map(day => ({
          day,
          isPlanned: true,
          color,
          plannedColor,
        }))
      )
    }

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
          color: day.isPlanned ? plannedColor : color,
          status: day.isPlanned ? 'planned' : 'done',
          isToday,
        })
      } else {
        cells.push({
          localDate,
          calendarId: calendar.id,
          displayDate: displayDateFromLocalDate(localDate),
          color: '',
          status: 'none',
          isToday,
        })
      }
    } else {
      cells.push({
        localDate,
        calendarId: calendar.id,
        displayDate: displayDateFromLocalDate(localDate),
        color: '',
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
  const { color, plannedColor } = props.calendar

  const calendarCells = createCalendarCellPropsList(
    props.endDate,
    props.numDaysBefore,
    props.calendar,
    props.nowDate,
    color,
    plannedColor
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
