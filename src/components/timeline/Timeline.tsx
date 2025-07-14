import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { CalendarGridStatelessListening } from '../calendar/CalendarGrid.tsx'
import { createDayStatusPropsListFromLogicCalendar } from './timeline-utils.ts'
import { getDateWithOffsetDays } from '../../lib/utils.ts'
import { createLogicCalendarFromTCalendar } from '../calendar/logic-calendar.ts'

export const Timeline: FC<{
  endDate: Date
  numDaysBefore: number
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
}> = props => {
  const dayStatuses = createDayStatusPropsListFromLogicCalendar(
    createLogicCalendarFromTCalendar(props.calendar),
    getDateWithOffsetDays(props.endDate, -props.numDaysBefore),
    props.numDaysBefore + 1 // "numDaysBefore + 1" meaning plus today.
  )

  return (
    <>
      <CalendarGridStatelessListening
        dayStatusRows={[{ dayStatuses }]}
        pleaseUpdateCalendar={props.pleaseUpdateCalendar}
      />
    </>
  )
}
