import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import {
  CalendarCellProps,
  CalendarLineProps,
  CalendarStateless,
} from '../calendar/Calendar'
import {
  displayDateFromLocalDate,
  getDateWithOffsetDays,
} from '../calendar/utils'
import {
  datesInTheSameDay,
  getDayCodeByDate,
  localDatesLT,
} from '../../lib/utils'

export function createCalendarLinePropsList(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar,
  nowDate: Date,
  color: string,
  plannedColor: string
): CalendarLineProps[] {
  // TODO: Improve this algorithm

  // Calculating cells
  let iDays = 0

  const cells: CalendarCellProps[] = []
  let iCell = numDaysBefore
  while (iCell >= 0) {
    const curDate = getDateWithOffsetDays(endDate, -iCell)
    const localDate = getDayCodeByDate(curDate)

    const isToday = datesInTheSameDay(curDate, nowDate)

    // All "TDays" to evaluate
    const allDays = [...calendar.days]
    const allDaysIndexFromThatArePlanned = allDays.length
    if (calendar.plannedDays && calendar.plannedDays.length) {
      allDays.push(...calendar.plannedDays)
    }

    while (
      iDays < allDays.length &&
      localDatesLT(allDays[iDays].date, localDate)
    ) {
      ++iDays
    }

    if (iDays < allDays.length) {
      const day = allDays[iDays]
      const justPlanned = iDays >= allDaysIndexFromThatArePlanned

      if (day.date === localDate) {
        cells.push({
          localDate,
          displayDate: displayDateFromLocalDate(localDate),
          color,
          plannedColor,
          status: justPlanned ? 'planned' : 'done',
          isToday,
        })
      } else {
        cells.push({
          localDate,
          displayDate: displayDateFromLocalDate(localDate),
          color,
          plannedColor,
          status: 'none',
          isToday,
        })
      }
    } else {
      cells.push({
        localDate,
        displayDate: displayDateFromLocalDate(localDate),
        color,
        plannedColor,
        status: 'none',
        isToday,
      })
    }

    --iCell
  }
  return [
    {
      cells,
    },
  ]
}

export const Timeline: FC<{
  endDate: Date
  numDaysBefore: number
  nowDate: Date
  calendar: TCalendar
}> = props => {
  const { color, plannedColor } = props.calendar

  const calendarLines = createCalendarLinePropsList(
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
        calendarLines={calendarLines}
        goInThePast={() => {
          console.log('goInThePast')
        }}
        goInTheFuture={() => {
          console.log('goInTheFuture')
        }}
      />
    </>
  )
}
