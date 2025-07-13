import { TCalendar, TCalendarCh } from '../../remote/sdk/types'

export type LogicCalendar = {
  color: string
  name: string
  apiCalendar?: {
    // On Parent Calendars this can be different from "logicDays*.apiCalendar"
    id: number
    usesNotes: boolean
  }
  logicDays: LogicDay[]
}
export type LogicDay = {
  date: string // Es. "2023-01-01"
  apiCalendar?: {
    id: number
    usesNotes: boolean
  }
  isPlanned?: boolean
  color: string
  onClick?: () => void
}

export function appendLogicDaysFromTCalendarCh(
  logicDays: LogicDay[],
  calendar: TCalendarCh
) {
  logicDays.push(
    ...calendar.days.map<LogicDay>(day => ({
      date: day.date,
      apiCalendar: {
        id: calendar.id,
        usesNotes: !!calendar.usesNotes,
      },
      color: calendar.color,
    }))
  )
  if (calendar.plannedDays && calendar.plannedDays.length) {
    logicDays.push(
      ...calendar.plannedDays.map<LogicDay>(day => ({
        date: day.date,
        apiCalendar: {
          id: calendar.id,
          usesNotes: !!calendar.usesNotes,
        },
        isPlanned: true,
        color: calendar.plannedColor,
      }))
    )
  }
}

export function createLogicDaysFromTCalendar(calendar: TCalendar): LogicDay[] {
  const logicDays: LogicDay[] = []

  // All "TDays" to evaluate
  appendLogicDaysFromTCalendarCh(logicDays, calendar)
  if (calendar.children && calendar.children.length) {
    for (const childCalendar of calendar.children) {
      appendLogicDaysFromTCalendarCh(logicDays, childCalendar)
    }
  }
  logicDays.sort((a, b) => a.date.localeCompare(b.date))

  return logicDays
}

export function createLogicCalendarFromTCalendar(
  calendar: TCalendar
): LogicCalendar {
  return {
    color: calendar.color,
    name: calendar.name,
    apiCalendar: {
      id: calendar.id,
      usesNotes: !!calendar.usesNotes,
    },
    logicDays: createLogicDaysFromTCalendar(calendar),
  }
}
