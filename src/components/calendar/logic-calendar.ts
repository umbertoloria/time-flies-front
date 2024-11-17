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

export function createLogicCalendarFromTCalendar(c: TCalendar): LogicCalendar {
  const allDays: AllDaysElem[] = []

  // All "TDays" to evaluate
  appendToAllDaysList(allDays, c)
  if (c.children && c.children.length) {
    for (const childCalendar of c.children) {
      appendToAllDaysList(allDays, childCalendar)
    }
  }
  finalizeAllDaysList(allDays)

  return {
    color: c.color,
    name: c.name,
    apiCalendar: {
      id: c.id,
    },
    allDays,
  }
}

export function getCalendarDataProps(lc: LogicCalendar): CalendarDataProps {
  return {
    idForUpdate: lc.apiCalendar?.id,
    color: lc.color,
    name: lc.name,
  }
}
