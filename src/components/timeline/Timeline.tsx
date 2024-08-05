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
  getNowDate,
  localDatesLT,
} from '../../lib/utils'

export const Timeline: FC<{
  endDate: Date
  numDaysBefore: number
  calendar: TCalendar
}> = props => {
  let iDatesInfo = 0

  const nowDate = getNowDate()
  const { color } = props.calendar

  // Calculating cells
  const cells: CalendarCellProps[] = []
  let iCell = props.numDaysBefore
  while (iCell >= 0) {
    const curDate = getDateWithOffsetDays(props.endDate, -iCell)
    const localDate = getDayCodeByDate(curDate)

    const isToday = datesInTheSameDay(curDate, nowDate)

    while (
      iDatesInfo < props.calendar.datesInfo.length &&
      localDatesLT(props.calendar.datesInfo[iDatesInfo].date, localDate)
    ) {
      ++iDatesInfo
    }

    if (iDatesInfo < props.calendar.datesInfo.length) {
      const dateInfo = props.calendar.datesInfo[iDatesInfo]

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
