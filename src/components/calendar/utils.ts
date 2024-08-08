import { TCalendar } from '../../remote/sdk/types'
import {
  datesInTheSameDay,
  getLocalDayByDate,
  getNowDate,
  localDatesLTE,
} from '../../lib/utils'
import { CalendarCellProps, CalendarLineProps } from './Calendar'

export function mapDataToCalendarLines(
  calendar: TCalendar,
  fromDate: Date,
  weeksToShow: number
): CalendarLineProps[] {
  // Requirement: "fromDate" *MUST* be a Monday.

  const fillingCellsCount = 7 as const // 7 days per week.
  const { color, plannedColor } = calendar
  const nowDate = getNowDate()

  const result: CalendarLineProps[] = []

  function appendCell(cellToAdd: CalendarCellProps) {
    if (result.length === 0) {
      result.push({
        cells: [],
      })
    }
    let cells = result[result.length - 1].cells
    if (cells.length === fillingCellsCount) {
      result.push({
        cells: [],
      })
      cells = result[result.length - 1].cells
    }
    cells.push(cellToAdd)
  }

  // All "TDays" to evaluate
  const calendarDays = [...calendar.days]
  const allDaysIndexFromThatArePlanned = calendarDays.length
  if (calendar.plannedDays && calendar.plannedDays.length) {
    calendarDays.push(...calendar.plannedDays)
  }

  if (calendarDays.length === 0) {
    // Given no dates.
    return result
  }

  // From "calendarDays", skipping all days that are before "fromLocalDate"
  const fromLocalDate = getLocalDayByDate(fromDate)
  let iCalendarDay = 0
  let curCalendarDay =
    iCalendarDay < calendarDays.length
      ? calendarDays[iCalendarDay++]
      : undefined
  while (
    !!curCalendarDay &&
    iCalendarDay < calendarDays.length &&
    !localDatesLTE(fromLocalDate, curCalendarDay.date)
  ) {
    curCalendarDay = calendarDays[iCalendarDay++]
  }

  // Filling "result"
  let dayOffset = 0
  const daysToShow = weeksToShow * 7
  while (dayOffset < daysToShow) {
    const curDate = getDateWithOffsetDays(fromDate, dayOffset)
    const curLocalDate = getLocalDayByDate(curDate)

    let status: 'planned' | 'done' | 'none' = 'none'

    if (!!curCalendarDay && iCalendarDay < calendarDays.length) {
      if (curLocalDate === curCalendarDay.date) {
        // Is ts Done or Just Planned?
        if (iCalendarDay > allDaysIndexFromThatArePlanned) {
          status = 'planned'
        } else {
          status = 'done'
        }

        curCalendarDay = calendarDays[iCalendarDay++]
      }
    }

    appendCell({
      localDate: curLocalDate,
      calendarId: calendar.id,
      displayDate: displayDateFromLocalDate(curLocalDate),
      color,
      plannedColor,
      status,
      isToday: datesInTheSameDay(curDate, nowDate),
    })

    ++dayOffset
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
