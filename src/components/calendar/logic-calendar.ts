import { TCalendar } from '../../remote/sdk/types'

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
  calendar: TCalendar
) {
  logicDays.push(
    ...calendar.days.map<LogicDay>(day => ({
      date: day.date,
      apiCalendar: {
        id: calendar.id,
        usesNotes: !!calendar.usesNotes,
      },
      isPlanned: false,
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
  appendLogicDaysFromTCalendar(logicDays, calendar)
  logicDays.sort((a, b) => a.date.localeCompare(b.date))

  return logicDays
}

export function createLogicCalendarFromTCalendar(
  calendar: TCalendar
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
