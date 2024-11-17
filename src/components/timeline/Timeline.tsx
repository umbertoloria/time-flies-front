import { FC } from 'react'
import { TCalendar } from '../../remote/sdk/types'
import { CalendarStateless } from '../calendar/Calendar'
import { createDayStatusesFromTCalendar } from './timeline-utils.ts'

export const Timeline: FC<{
  endDate: Date
  numDaysBefore: number
  calendar: TCalendar
  pleaseUpdateCalendar: () => void
}> = props => {
  const dayStatuses = createDayStatusesFromTCalendar(
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
