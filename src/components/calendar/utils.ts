import { DayStatusRow } from '@/components/calendar/CalendarGrid'
import {
  isLocalDateToday,
  isLocalDateTomorrow,
  isLocalDateYesterday,
} from '@/lib/utils'

export function getFirstAndLastLocalDatesFromDayStatusRows(
  dayStatusRows: DayStatusRow[]
) {
  // Note: Param "dayStatusRows" is expected to be *NON-EMPTY*.
  if (dayStatusRows.length === 0) {
    throw new Error('Expected non-empty "dayStatusRows" param')
  }

  // Calculate "firstLocalDate" and "lastLocalDate"
  let i = 0
  const firstLocalDate = dayStatusRows[i].dayStatuses[0].date
  let j = 1
  let lastLocalDate = firstLocalDate
  while (i < dayStatusRows.length) {
    const dayStatusRow = dayStatusRows[i]
    j = 0
    while (j < dayStatusRow.dayStatuses.length) {
      const cell = dayStatusRow.dayStatuses[j]
      lastLocalDate = cell.date
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

export function prettyDate(localDate: string) {
  if (isLocalDateToday(localDate)) {
    return 'Oggi'
  }
  if (isLocalDateYesterday(localDate)) {
    return 'Ieri'
  }
  if (isLocalDateTomorrow(localDate)) {
    return 'Domani'
  }
  return displayDateFromLocalDate(localDate)
}

export function moveDateToClosestNonFutureMonday(date: Date) {
  const weekday = date.getDay() // 0 => sunday
  const numDaysFromMonday = (7 + weekday - 1) % 7

  const clone = new Date(date)
  clone.setDate(clone.getDate() - numDaysFromMonday)
  return clone
}
