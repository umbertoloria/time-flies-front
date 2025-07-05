import { TCalendar, TCalendarCh } from '../../remote/sdk/types'
import { DayStatusDayData } from './DayStatus.tsx'

export type LogicCalendar = {
  color: string
  name: string
  apiCalendar?: {
    id: number
  }
  logicDays: LogicDay[]
}
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
    ...calendar.days.map<LogicDay>(day => ({
      dayData: {
        date: day.date,
        notes: day.notes
          ? {
              text: day.notes,
            }
          : undefined,
      },
      color: calendar.color,
    }))
  )
  if (calendar.plannedDays && calendar.plannedDays.length) {
    logicDays.push(
      ...calendar.plannedDays.map<LogicDay>(day => ({
        dayData: {
          date: day.date,
          notes: day.notes
            ? {
                text: day.notes,
              }
            : undefined,
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
  logicDays.sort((a, b) => a.dayData.date.localeCompare(b.dayData.date))

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
    },
    logicDays: createLogicDaysFromTCalendar(calendar),
  }
}
