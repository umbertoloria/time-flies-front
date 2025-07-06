import { TCalendar } from '../../remote/sdk/types'
import { DayStatusProps } from '../calendar/DayStatus.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils.ts'
import {
  createLogicCalendarFromTCalendar,
  LogicCalendar,
} from '../calendar/logic-calendar.ts'

export function createDayStatusPropsListFromLogicCalendar(
  logicCalendar: LogicCalendar,
  daysToShow: number,
  fromDate: Date
) {
  const result: DayStatusProps[] = []

  const { logicDays } = logicCalendar

  let iLogicDay = 0
  for (let dayOffset = 0; dayOffset < daysToShow; ++dayOffset) {
    const curDate = getDateWithOffsetDays(fromDate, dayOffset)
    const curLocalDate = getLocalDayByDate(curDate)

    while (
      iLogicDay < logicDays.length &&
      localDatesLT(logicDays[iLogicDay].date, curLocalDate)
    ) {
      ++iLogicDay
    }
    // From now on, "curLogicDay" will always be from "curLocalDate" to the future
    // (or NULL if there aren't).

    const curLogicDay =
      iLogicDay < logicDays.length ? logicDays[iLogicDay] : undefined
    if (!!curLogicDay && curLogicDay.date === curLocalDate) {
      result.push({
        date: curLogicDay.date,
        apiData: curLogicDay.apiCalendar
          ? {
              calendarId: curLogicDay.apiCalendar.id,
            }
          : undefined,
        color: curLogicDay.color,
        status: curLogicDay.isPlanned ? 'planned' : 'done',
        onClick: curLogicDay.onClick,
      })

      // Dealing with siblings
      if (
        iLogicDay + 1 < logicDays.length &&
        logicDays[iLogicDay + 1].date === curLocalDate
      ) {
        let siblings_offset = 1
        while (
          iLogicDay + siblings_offset < logicDays.length &&
          logicDays[iLogicDay + siblings_offset].date === curLocalDate
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
      result.push({
        // "Empty day"
        date: curLocalDate,
        apiData: logicCalendar.apiCalendar
          ? {
              // On Parent Calendar: using Parent Calendar ID for empty days.
              calendarId: logicCalendar.apiCalendar.id,
            }
          : undefined,
        // color: undefined,
        // status: undefined,
        // onClick: undefined,
      })
    }
  }

  return result
}

export function createDayStatusesFromTCalendar(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar
): DayStatusProps[] {
  return createDayStatusPropsListFromLogicCalendar(
    createLogicCalendarFromTCalendar(calendar),
    numDaysBefore + 1, // "numDaysBefore + 1" meaning plus today.
    getDateWithOffsetDays(endDate, -numDaysBefore)
  )
}
