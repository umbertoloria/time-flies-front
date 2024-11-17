import { TCalendarCh } from '../../remote/sdk/types'
import { CalendarLineProps } from './Calendar'
import { DayStatusDayData } from './DayStatus.tsx'

export type AllDaysElem = {
  dayData: DayStatusDayData
  isPlanned?: boolean
  color: string
  onClick?: () => void
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

export function getFirstAndLastLocalDatesFromCalendarLines(
  calendarLines: CalendarLineProps[]
) {
  // Calculate "firstLocalDate" and "lastLocalDate"
  let i = 0
  const firstLocalDate = calendarLines[i].cells[0].dayData.date
  let j = 1
  let lastLocalDate = firstLocalDate
  while (i < calendarLines.length) {
    const calendarLine = calendarLines[i]
    j = 0
    while (j < calendarLine.cells.length) {
      const cell = calendarLine.cells[j]
      lastLocalDate = cell.dayData.date
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
