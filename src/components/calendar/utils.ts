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
  // TODO: Improve this algorithm

  const { color, plannedColor } = calendar

  // All "TDays" to evaluate
  const allDays = [...calendar.days]
  const allDaysIndexFromThatArePlanned = allDays.length
  if (calendar.plannedDays && calendar.plannedDays.length) {
    allDays.push(...calendar.plannedDays)
  }

  if (allDays.length === 0) {
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
  function appendCell(cellToAdd: CalendarCellProps) {
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
    const localDate = getDayCodeByDate(curDate)
    appendCell({
      localDate,
      displayDate: displayDateFromLocalDate(localDate),
      color,
      plannedColor,
      status: 'none',
      isToday: datesInTheSameDay(curDate, nowDate),
    })
    ++i
  }

  let daysShown = 0
  const strDate = getDayCodeByDate(getDateWithOffsetDays(fromDate, daysShown))

  let iDay = 0
  let lastDateInfo = allDays[iDay++]
  while (!!lastDateInfo && !localDatesLTE(strDate, lastDateInfo.date)) {
    lastDateInfo = allDays[iDay++]
  }

  while (daysShown < daysToShow) {
    const curDate = getDateWithOffsetDays(fromDate, daysShown)
    const strDate = getDayCodeByDate(curDate)

    let done = false
    let justPlanned = false
    if (lastDateInfo) {
      if (strDate === lastDateInfo.date) {
        done = true
        if (iDay > allDaysIndexFromThatArePlanned) {
          justPlanned = true
        }
        lastDateInfo = allDays[iDay++]
      }
    }

    appendCell({
      localDate: strDate,
      displayDate: displayDateFromLocalDate(strDate),
      color,
      plannedColor,
      status: justPlanned ? 'planned' : done ? 'done' : 'none',
      isToday: datesInTheSameDay(curDate, nowDate),
    })

    ++daysShown
  }

  if (startFillCellsCount > 0) {
    const endFillCellsCount = fillingCellsCount - startFillCellsCount
    i = 0
    while (i < endFillCellsCount) {
      const curDate = getDateWithOffsetDays(fromDate, daysToShow + i)
      appendCell({
        localDate: getDayCodeByDate(curDate),
        displayDate: displayDateFromLocalDate(getDayCodeByDate(curDate)),
        color,
        plannedColor,
        status: 'none',
        isToday: datesInTheSameDay(curDate, nowDate),
      })
      ++i
    }
  }

  return result
}

export function getFirstAndLastLocalDatesFromCalendarLines(
  calendarLines: CalendarLineProps[]
) {
  // Calculate "firstLocalDate" and "lastLocalDate"
  let i = 0
  const firstLocalDate = calendarLines[i].cells[0].localDate
  let j = 1
  let lastLocalDate = firstLocalDate
  while (i < calendarLines.length) {
    const calendarLine = calendarLines[i]
    j = 0
    while (j < calendarLine.cells.length) {
      const cell = calendarLine.cells[j]
      lastLocalDate = cell.localDate
      ++j
    }
    ++i
  }
  return {
    firstLocalDate,
    lastLocalDate,
  }
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
