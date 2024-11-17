import { TCalendar } from '../../remote/sdk/types'
import { DayStatusProps } from '../calendar/DayStatus.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils.ts'
import {
  appendLogicDaysFromTCalendarCh,
  finalizeLogicDays,
  LogicDay,
} from '../calendar/utils.ts'

export function createDayStatusesFromTCalendar(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar
): DayStatusProps[] {
  const dayStatuses: DayStatusProps[] = []

  let iDays = 0
  let iCell = numDaysBefore
  while (iCell >= 0) {
    const curDate = getDateWithOffsetDays(endDate, -iCell)
    const localDate = getLocalDayByDate(curDate)

    // All "TDays" to evaluate
    const logicDays: LogicDay[] = []
    appendLogicDaysFromTCalendarCh(logicDays, calendar)
    if (calendar.children && calendar.children.length) {
      for (const childCalendar of calendar.children) {
        appendLogicDaysFromTCalendarCh(logicDays, childCalendar)
      }
    }
    finalizeLogicDays(logicDays)

    while (
      iDays < logicDays.length &&
      localDatesLT(logicDays[iDays].dayData.date, localDate)
    ) {
      ++iDays
    }

    if (iDays < logicDays.length) {
      const day = logicDays[iDays]

      if (day.dayData.date === localDate) {
        dayStatuses.push({
          dayData: day.dayData,
          apiData: {
            calendarId: calendar.id,
          },
          color: day.color,
          status: day.isPlanned ? 'planned' : 'done',
        })
      } else {
        dayStatuses.push({
          dayData: {
            // "Fake"
            date: localDate,
          },
          apiData: {
            calendarId: calendar.id,
          },
          // color: undefined,
          // status: undefined,
        })
      }
    } else {
      dayStatuses.push({
        dayData: {
          // "Fake"
          date: localDate,
        },
        apiData: {
          calendarId: calendar.id,
        },
        // color: undefined,
        // status: undefined,
      })
    }

    --iCell
  }

  return dayStatuses
}
