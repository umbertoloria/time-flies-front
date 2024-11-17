import { TCalendar } from '../../remote/sdk/types'
import {
  appendLogicDaysFromTCalendarCh,
  finalizeLogicDays,
  LogicDay,
} from './utils.ts'

export type LogicCalendar = {
  color: string
  name: string
  apiCalendar?: {
    id: number
  }
  logicDays: LogicDay[]
}

export const createLogicCalendarFromTCalendar = (
  calendar: TCalendar
): LogicCalendar => {
  const logicDays: LogicDay[] = []

  // All "TDays" to evaluate
  appendLogicDaysFromTCalendarCh(logicDays, calendar)
  if (calendar.children && calendar.children.length) {
    for (const childCalendar of calendar.children) {
      appendLogicDaysFromTCalendarCh(logicDays, childCalendar)
    }
  }
  finalizeLogicDays(logicDays)

  return {
    color: calendar.color,
    name: calendar.name,
    apiCalendar: {
      id: calendar.id,
    },
    logicDays,
  }
}
