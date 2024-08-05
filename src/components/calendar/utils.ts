import { TCalendar } from '../../remote/sdk/types'
import {
  datesInTheSameDay,
  getDayCodeByDate,
  getNowDate,
  localDatesLTE,
} from '../../lib/utils'
import { CalendarCellProps, CalendarLineProps } from './Calendar'

export function mapDataToCalendarLines(
  calendar: TCalendar,
  fromDate: Date,
  daysToShow: number
): CalendarLineProps[] {
  const { color, datesInfo } = calendar
  if (datesInfo.length === 0) {
    // Given no dates.
    return [
      {
        cells: [],
      },
    ]
  }

  const fillingCellsCount = 7 as const

  const result: CalendarLineProps[] = [
    {
      cells: [],
    },
  ]
  function addCell(cellToAdd: CalendarCellProps) {
    const lastRow = result[result.length - 1]
    const { cells } = lastRow
    cells.push(cellToAdd)
    if (cells.length === fillingCellsCount) {
      result.push({
        cells: [],
      })
    }
  }

  const nowDate = getNowDate()

  const fromDateWeekday = fromDate.getDay() // 0 => sunday
  const startFillCellsCount =
    (fillingCellsCount + fromDateWeekday - 1) % fillingCellsCount
  let i = 0
  while (i < startFillCellsCount) {
    const curDate = getDateWithOffsetDays(fromDate, -(startFillCellsCount - i))
    addCell({
      displayDate: displayDateFromLocalDate(getDayCodeByDate(curDate)),
      color,
      done: false,
      isToday: datesInTheSameDay(curDate, nowDate),
    })
    ++i
  }

  let daysShown = 0
  const strDate = getDayCodeByDate(getDateWithOffsetDays(fromDate, daysShown))

  let iData = 0
  let lastDateInfo = datesInfo[iData++]
  while (!!lastDateInfo && !localDatesLTE(strDate, lastDateInfo.date)) {
    lastDateInfo = datesInfo[iData++]
  }

  while (daysShown < daysToShow) {
    const curDate = getDateWithOffsetDays(fromDate, daysShown)
    const strDate = getDayCodeByDate(curDate)

    let done = false
    if (lastDateInfo) {
      if (strDate === lastDateInfo.date) {
        done = true
        lastDateInfo = datesInfo[iData++]
      }
    }

    addCell({
      displayDate: displayDateFromLocalDate(strDate),
      color,
      done,
      isToday: datesInTheSameDay(curDate, nowDate),
    })

    ++daysShown
  }

  if (startFillCellsCount > 0) {
    const endFillCellsCount = fillingCellsCount - startFillCellsCount
    i = 0
    while (i < endFillCellsCount) {
      const curDate = getDateWithOffsetDays(fromDate, daysToShow + i)
      addCell({
        displayDate: displayDateFromLocalDate(getDayCodeByDate(curDate)),
        color,
        done: false,
        isToday: datesInTheSameDay(curDate, nowDate),
      })
      ++i
    }
  }

  return result
}

export function getDateWithOffsetDays(fromDate: Date, offset: number) {
  const result = new Date(fromDate)
  result.setDate(result.getDate() + offset)
  return result
}

export function displayDateFromLocalDate(localDate: string) {
  const formatter = new Intl.DateTimeFormat('it', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return formatter.format(new Date(localDate))
}

export function moveDateToWeekStart(date: Date) {
  const weekday = date.getDay() // 0 => sunday
  const numDaysFromMonday = (7 + weekday - 1) % 7

  const clone = new Date(date)
  clone.setDate(clone.getDate() - numDaysFromMonday)
  return clone
}
