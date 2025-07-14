import { FC, useState } from 'react'
import {
  getDateFromLocalDate,
  getDateWithOffsetDays,
  getTodayLocalDate,
} from '../../lib/utils.ts'
import { LogicCalendarGridListening } from '../calendar/CalendarGrid.tsx'
import { LogicDay } from '../calendar/logic-calendar.ts'

const defaultNumWeeks = 4 * 2 // Two months
export const CalendarForScheduler: FC<{
  datesWithRecords: string[]
  setLocalDate: (localDate: string) => void
}> = props => {
  const [numWeeks] = useState(defaultNumWeeks)
  const [weeks4Before, setWeeks4Before] = useState(0)
  const fromDate1 = getDateWithOffsetDays(
    getDateFromLocalDate(getTodayLocalDate()),
    -7 * (numWeeks - 1 + 4 * weeks4Before)
  )
  const manualCalendarColor = '#7e9'

  // Logic Days
  const logicDays = props.datesWithRecords.map<LogicDay>(date => ({
    date,
    // apiCalendar: undefined,
    // isPlanned: undefined,
    color: manualCalendarColor,
    onClick() {
      props.setLocalDate(date)
    },
  }))
  const lastLocalDate = getTodayLocalDate()
  logicDays.push({
    date: lastLocalDate,
    // apiCalendar: undefined,
    // isPlanned: undefined,
    color: manualCalendarColor,
    onClick() {
      props.setLocalDate(lastLocalDate)
    },
  })

  return (
    <LogicCalendarGridListening
      startWeekFromDate={fromDate1}
      numWeeks={numWeeks}
      logicCalendar={{
        color: manualCalendarColor,
        name: 'Calendario',
        // onClickOpenDialogForCalendarOverview: undefined,
        // apiCalendar: undefined,
        logicDays,
      }}
      pleaseUpdateCalendar={() => {
        // No Calendar ID so no update requests...
      }}
      goInThePast={() => {
        setWeeks4Before(weeks4Before + 1)
      }}
      goInTheFuture={() => {
        setWeeks4Before(weeks4Before - 1)
      }}
    />
  )
}
