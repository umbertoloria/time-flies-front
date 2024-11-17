import { TCalendar, TCalendarCh } from '../../remote/sdk/types'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLTE,
} from '../../lib/utils'
import { CalendarCellProps, CalendarLineProps } from './Calendar'
import { DayStatusDayData } from './DayStatus.tsx'

export type AllDaysElem = {
  dayData: DayStatusDayData
  isPlanned?: boolean
  color: string
}

export function appendToAllDaysList(
  allDays: AllDaysElem[],
  calendar: TCalendarCh
) {
  allDays.push(
    ...calendar.days.map(day => ({
      dayData: {
        date: day.date,
        notes: day.notes,
      },
      color: calendar.color,
    }))
  )
  if (calendar.plannedDays && calendar.plannedDays.length) {
    allDays.push(
      ...calendar.plannedDays.map(day => ({
        dayData: {
          date: day.date,
          notes: day.notes,
        },
        isPlanned: true,
        color: calendar.plannedColor,
      }))
    )
  }
}

export function finalizeAllDaysList(allDays: AllDaysElem[]) {
  allDays.sort((a, b) =>
    a.dayData.date.localeCompare(b.dayData.date) < 0 ? -1 : 1
  )
}

export function mapDataToCalendarLines(
  calendar: TCalendar,
  fromDate: Date,
  weeksToShow: number
): CalendarLineProps[] {
  // Requirement: "fromDate" *MUST* be a Monday.

  const fillingCellsCount = 7 as const // 7 days per week.

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
  const allDays: AllDaysElem[] = []
  appendToAllDaysList(allDays, calendar)
  if (calendar.children && calendar.children.length) {
    for (const childCalendar of calendar.children) {
      appendToAllDaysList(allDays, childCalendar)
    }
  }
  finalizeAllDaysList(allDays)

  if (allDays.length === 0) {
    // Given no dates.
    return result
  }

  // From "allDays", skipping all days that are before "fromLocalDate"
  const fromLocalDate = getLocalDayByDate(fromDate)
  let iNextCalendarDay = 0
  let curCalendarDay =
    iNextCalendarDay < allDays.length ? allDays[iNextCalendarDay++] : undefined

  while (
    !!curCalendarDay &&
    iNextCalendarDay < allDays.length &&
    !localDatesLTE(fromLocalDate, curCalendarDay.dayData.date)
  ) {
    curCalendarDay = allDays[iNextCalendarDay++]
  }

  // Filling "result"
  let dayOffset = 0
  const daysToShow = weeksToShow * 7
  while (dayOffset < daysToShow) {
    const curDate = getDateWithOffsetDays(fromDate, dayOffset)
    const curLocalDate = getLocalDayByDate(curDate)

    let color: undefined | string = undefined
    let status: 'planned' | 'done' | 'none' = 'none'
    let dayData: undefined | DayStatusDayData = undefined

    if (!!curCalendarDay && iNextCalendarDay - 1 < allDays.length) {
      if (curLocalDate === curCalendarDay.dayData.date) {
        color = curCalendarDay.color

        // Is it Done or Just Planned?
        if (curCalendarDay.isPlanned) {
          status = 'planned'
        } else {
          status = 'done'
        }

        dayData = curCalendarDay.dayData
        curCalendarDay = allDays[iNextCalendarDay++]
      }
    }

    appendCell({
      localDate: curLocalDate,
      calendarId: calendar.id,
      displayDate: displayDateFromLocalDate(curLocalDate),
      color: color || undefined,
      status,
      dayData,
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
