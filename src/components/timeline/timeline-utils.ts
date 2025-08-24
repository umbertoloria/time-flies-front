import { DayStatusProps } from '../calendar/DayStatus.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils.ts'
import { LogicCalendar } from '../calendar/logic-calendar.ts'

export function createDayStatusPropsListFromLogicCalendar(
  logicCalendar: LogicCalendar,
  fromDate: Date,
  numDaysToShow: number
) {
  const result: DayStatusProps[] = []

  const { logicDays } = logicCalendar

  let iLogicDay = 0
  for (let dayOffset = 0; dayOffset < numDaysToShow; ++dayOffset) {
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
              calendar: {
                id: curLogicDay.apiCalendar.id,
                usesNotes: curLogicDay.apiCalendar.usesNotes,
              },
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
        // TODO: Multiple days in various Calendars
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
              calendar: {
                id: logicCalendar.apiCalendar.id,
                usesNotes: logicCalendar.apiCalendar.usesNotes,
              },
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
