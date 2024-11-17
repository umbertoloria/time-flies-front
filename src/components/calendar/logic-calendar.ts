import { CalendarDataProps } from './Calendar.tsx'
import { TCalendar } from '../../remote/sdk/types'
import {
  AllDaysElem,
  appendToAllDaysList,
  finalizeAllDaysList,
} from './utils.ts'

export type LogicCalendar = {
  color: string
  name: string
  apiCalendar?: {
    id: number
  }
  allDays: AllDaysElem[]
}

export const createLogicCalendarFromTCalendar = (
  calendar: TCalendar
): LogicCalendar => {
  const allDays: AllDaysElem[] = []

  // All "TDays" to evaluate
  appendToAllDaysList(allDays, calendar)
  if (calendar.children && calendar.children.length) {
    for (const childCalendar of calendar.children) {
      appendToAllDaysList(allDays, childCalendar)
    }
  }
  finalizeAllDaysList(allDays)

  return {
    color: calendar.color,
    name: calendar.name,
    apiCalendar: {
      id: calendar.id,
    },
    allDays,
  }
}

export const getCalendarDataProps = (lc: LogicCalendar): CalendarDataProps => ({
  idForUpdate: lc.apiCalendar?.id,
  color: lc.color,
  name: lc.name,
})
