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
    // From now on, "day" will always be from "curLocalDate" to the future
    // (or NULL if there aren't).

    const day = iLocalDay < logicDays.length ? logicDays[iLocalDay] : undefined
    if (!!day && day.dayData.date === curLocalDate) {
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
