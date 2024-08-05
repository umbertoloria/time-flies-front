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

function createCalendarCellPropsList(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar,
  nowDate: Date,
  color: string
): CalendarCellProps[] {
  let iDatesInfo = 0

  const cells: CalendarCellProps[] = []
  let iCell = numDaysBefore
  while (iCell >= 0) {
    const curDate = getDateWithOffsetDays(endDate, -iCell)
    const localDate = getDayCodeByDate(curDate)

    const isToday = datesInTheSameDay(curDate, nowDate)

    while (
      iDatesInfo < calendar.datesInfo.length &&
      localDatesLT(calendar.datesInfo[iDatesInfo].date, localDate)
    ) {
      ++iDatesInfo
    }

    if (iDatesInfo < calendar.datesInfo.length) {
      const dateInfo = calendar.datesInfo[iDatesInfo]

      if (dateInfo.date === localDate) {
        cells.push({
          localDate,
          displayDate: displayDateFromLocalDate(localDate),
          color,
          done: true,
          isToday,
        })
      } else {
        cells.push({
          localDate,
          displayDate: displayDateFromLocalDate(localDate),
          color,
          done: false,
          isToday,
        })
      }
    } else {
      cells.push({
        localDate,
        displayDate: displayDateFromLocalDate(localDate),
        color,
        done: false,
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
}> = props => {
  const { color } = props.calendar

  // Calculating cells
  const cells = createCalendarCellPropsList(
    props.endDate,
    props.numDaysBefore,
    props.calendar,
    props.nowDate,
    color
  )

  const calendarLines: CalendarLineProps[] = [
    {
      cells,
    },
  ]

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
