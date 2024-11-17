import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { CalendarStateless } from '../calendar/Calendar'
import {
  appendLogicDaysFromTCalendarCh,
  finalizeLogicDays,
  LogicDay,
} from '../calendar/utils'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  localDatesLT,
} from '../../lib/utils'
import { DayStatusProps } from '../calendar/DayStatus.tsx'

export function createDayStatusPropsList(
  endDate: Date,
  numDaysBefore: number,
  calendar: TCalendar
): DayStatusProps[] {
  // TODO: Improve this algorithm
  let iDays = 0
  const dayStatusPropsList: DayStatusProps[] = []
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
        dayStatusPropsList.push({
          dayData: day.dayData,
          apiData: {
            calendarId: calendar.id,
          },
          color: day.color,
          status: day.isPlanned ? 'planned' : 'done',
        })
      } else {
        dayStatusPropsList.push({
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
      dayStatusPropsList.push({
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
  return dayStatusPropsList
}

export const Timeline: FC<{
  endDate: Date
  numDaysBefore: number
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
}> = props => {
  const dayStatuses = createDayStatusPropsList(
    props.endDate,
    props.numDaysBefore,
    props.calendar
  )

  return (
    <>
      <CalendarStateless
        dayStatusRows={[{ dayStatuses }]}
        pleaseUpdateCalendar={props.pleaseUpdateCalendar}
      />
    </>
  )
}
