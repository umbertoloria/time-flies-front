import { TCalendarCh } from '../../remote/sdk/types'
import { DayStatusRow } from './Calendar'
import { DayStatusDayData } from './DayStatus.tsx'

export type LogicDay = {
  dayData: DayStatusDayData
  isPlanned?: boolean
  color: string
  onClick?: () => void
}

export function appendLogicDaysFromTCalendarCh(
  logicDays: LogicDay[],
  calendar: TCalendarCh
) {
  logicDays.push(
    ...calendar.days.map(day => ({
      dayData: {
        date: day.date,
        notes: day.notes,
      },
      color: calendar.color,
    }))
  )
  if (calendar.plannedDays && calendar.plannedDays.length) {
    logicDays.push(
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

export function finalizeLogicDays(logicDays: LogicDay[]) {
  logicDays.sort((a, b) =>
    a.dayData.date.localeCompare(b.dayData.date) < 0 ? -1 : 1
  )
}

export function getFirstAndLastLocalDatesFromDayStatusRows(
  dayStatusRows: DayStatusRow[]
) {
  // Note: Param "dayStatusRows" is expected to be *NON-EMPTY*.
  if (dayStatusRows.length === 0) {
    throw new Error('Expected non-empty "dayStatusRows" param')
  }

  // Calculate "firstLocalDate" and "lastLocalDate"
  let i = 0
  const firstLocalDate = dayStatusRows[i].dayStatuses[0].dayData.date
  let j = 1
  let lastLocalDate = firstLocalDate
  while (i < dayStatusRows.length) {
    const dayStatusRow = dayStatusRows[i]
    j = 0
    while (j < dayStatusRow.dayStatuses.length) {
      const cell = dayStatusRow.dayStatuses[j]
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
