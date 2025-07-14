import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { CalendarGridStatelessListening } from '../calendar/CalendarGrid.tsx'
import { createDayStatusPropsListFromLogicCalendar } from './timeline-utils.ts'
import { createLogicCalendarFromTCalendar } from '../calendar/logic-calendar.ts'

export const Timeline: FC<{
  fromDate: Date
  numDaysToShow: number
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
}> = props => {
  const dayStatuses = createDayStatusPropsListFromLogicCalendar(
    createLogicCalendarFromTCalendar(props.calendar),
    props.fromDate,
    props.numDaysToShow
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
