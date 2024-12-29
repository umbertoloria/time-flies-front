import { TCalendar } from '../../remote/sdk/types'
import { DayStatusProps } from '../calendar/DayStatus.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils.ts'
import { createLogicDaysFromTCalendar } from '../calendar/logic-calendar.ts'

export function createDayStatusesFromTCalendar(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar
): DayStatusProps[] {
  const dayStatuses: DayStatusProps[] = []

  // All Logic Days to evaluate
  const logicDays = createLogicDaysFromTCalendar(calendar)

  let iLocalDay = 0
  // "numDaysBefore + 1" meaning plus today.
  for (let dayOffset = 0; dayOffset < numDaysBefore + 1; ++dayOffset) {
    const curDate = getDateWithOffsetDays(endDate, dayOffset - numDaysBefore)
    const curLocalDate = getLocalDayByDate(curDate)

    while (
      iLocalDay < logicDays.length &&
      localDatesLT(logicDays[iLocalDay].dayData.date, curLocalDate)
    ) {
      ++iLocalDay
    }
    // From now on, "curLogicDay" will always be from "curLocalDate" to the future
    // (or NULL if there aren't).

    const curLogicDay =
      iLocalDay < logicDays.length ? logicDays[iLocalDay] : undefined
    if (!!curLogicDay && curLogicDay.dayData.date === curLocalDate) {
      dayStatuses.push({
        dayData: curLogicDay.dayData,
        apiData: {
          calendarId: calendar.id,
        },
        color: curLogicDay.color,
        status: curLogicDay.isPlanned ? 'planned' : 'done',
        onClick: curLogicDay.onClick,
      })
    } else {
      dayStatuses.push({
        dayData: {
          // "Empty day"
          date: curLocalDate,
        },
        apiData: {
          calendarId: calendar.id,
        },
        // color: undefined,
        // status: undefined,
      })
    }
  }

  return dayStatuses
}
