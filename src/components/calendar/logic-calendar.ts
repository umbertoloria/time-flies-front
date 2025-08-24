import { TCalendarPrev } from '../../remote/sdk/types'

export type LogicCalendar = {
  color: string
  name: string
  onClickOpenDialogForCalendarOverview?: boolean
  apiCalendar?: {
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
  isPlanned: boolean
  color: string
  onClick?: () => void
}

export function appendLogicDaysFromTCalendar(
  logicDays: LogicDay[],
  calendar: TCalendarPrev
) {
  if (calendar.doneTaskDates && calendar.doneTaskDates.length) {
    logicDays.push(
      ...calendar.doneTaskDates.map<LogicDay>(date => ({
        date,
        apiCalendar: {
          id: calendar.id,
          usesNotes: !!calendar.usesNotes,
        },
        isPlanned: false,
        color: calendar.color,
      }))
    )
  }
  if (calendar.todoDates && calendar.todoDates.length) {
    logicDays.push(
      ...calendar.todoDates.map<LogicDay>(date => ({
        date,
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

export function createLogicDaysFromTCalendar(
  calendar: TCalendarPrev
): LogicDay[] {
  const logicDays: LogicDay[] = []

  // All "TDays" to evaluate
  appendLogicDaysFromTCalendar(logicDays, calendar)
  logicDays.sort((a, b) => a.date.localeCompare(b.date))

  return logicDays
}

export function createLogicCalendarFromTCalendar(
  calendar: TCalendarPrev
): LogicCalendar {
  return {
    color: calendar.color,
    name: calendar.name,
    onClickOpenDialogForCalendarOverview: true,
    apiCalendar: {
      id: calendar.id,
      usesNotes: !!calendar.usesNotes,
    },
    logicDays: createLogicDaysFromTCalendar(calendar),
  }
}
