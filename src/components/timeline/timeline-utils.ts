import { TCalendar } from '../../remote/sdk/types'
import { DayStatusProps } from '../calendar/DayStatus.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils.ts'
import { createLogicCalendarFromTCalendar } from '../calendar/logic-calendar.ts'

export function createDayStatusesFromTCalendar(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar
): DayStatusProps[] {
  const logicCalendar = createLogicCalendarFromTCalendar(calendar)
  // "numDaysBefore + 1" meaning plus today.
  const daysToShow = numDaysBefore + 1

  const dayStatuses: DayStatusProps[] = []
  const appendCell = (dayStatusProps: DayStatusProps) => {
    dayStatuses.push(dayStatusProps)
  }
  const { logicDays } = logicCalendar

  let iLogicDay = 0
  for (let dayOffset = 0; dayOffset < daysToShow; ++dayOffset) {
    const curDate = getDateWithOffsetDays(endDate, dayOffset - numDaysBefore)
    const curLocalDate = getLocalDayByDate(curDate)

    while (
      iLogicDay < logicDays.length &&
      localDatesLT(logicDays[iLogicDay].dayData.date, curLocalDate)
    ) {
      ++iLogicDay
    }
    // From now on, "curLogicDay" will always be from "curLocalDate" to the future
    // (or NULL if there aren't).

    const curLogicDay =
      iLogicDay < logicDays.length ? logicDays[iLogicDay] : undefined
    if (!!curLogicDay && curLogicDay.dayData.date === curLocalDate) {
      appendCell({
        dayData: curLogicDay.dayData,
        apiData: logicCalendar.apiCalendar
          ? {
              calendarId: logicCalendar.apiCalendar.id,
            }
          : undefined,
        color: curLogicDay.color,
        status: curLogicDay.isPlanned ? 'planned' : 'done',
        onClick: curLogicDay.onClick,
      })

      // Dealing with siblings
      if (
        iLogicDay + 1 < logicDays.length &&
        logicDays[iLogicDay + 1].dayData.date === curLocalDate
      ) {
        let siblings_offset = 1
        while (
          iLogicDay + siblings_offset < logicDays.length &&
          logicDays[iLogicDay + siblings_offset].dayData.date === curLocalDate
        ) {
          ++siblings_offset
        }
        // TODO: Multiple days in various Calendars (Parent and Children)
        console.log(
          'Found ' + siblings_offset + ' Logic Days on the same date',
          curLocalDate,
          curLogicDay
        )
      }
    } else {
      appendCell({
        dayData: {
          // "Empty day"
          date: curLocalDate,
          // notes: undefined,
        },
        apiData: logicCalendar.apiCalendar
          ? {
              calendarId: logicCalendar.apiCalendar.id,
            }
          : undefined,
        // color: undefined,
        // status: undefined,
        // onClick: undefined,
      })
    }
  }

  return dayStatuses
}
