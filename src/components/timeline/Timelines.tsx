import { FC } from 'react'
import {
  CalendarArrowControl,
  CalendarTitle,
} from '../calendar/CalendarGrid.tsx'
import { TCalendar } from '../../remote/sdk/types'
import { getITMonthFromLocalDate } from '../../lib/utils.ts'
import { getFirstAndLastLocalDatesFromDayStatusRows } from '../calendar/utils.ts'
import { Timeline } from './Timeline.tsx'
import { createDayStatusPropsListFromLogicCalendar } from './timeline-utils.ts'
import { createLogicCalendarFromTCalendar } from '../calendar/logic-calendar.ts'

export const Timelines: FC<{
  fromDate: Date
  numDaysToShow: number
  allCalendars: TCalendar[]
  isLoading: boolean
  goInThePast: () => void
  goInTheFuture: () => void
  pleaseUpdateCalendar: (calendarId: number) => void
}> = props => {
  if (props.allCalendars.length < 1) {
    return <></>
  }

  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromDayStatusRows([
      {
        dayStatuses: createDayStatusPropsListFromLogicCalendar(
          createLogicCalendarFromTCalendar(props.allCalendars[0]),
          props.fromDate,
          props.numDaysToShow
        ),
      },
    ])
  const firstMonthLang = getITMonthFromLocalDate(firstLocalDate)
  const lastMonthLang = getITMonthFromLocalDate(lastLocalDate)

  return (
    <>
      <div className='pt-2 w-full text-center'>
        <CalendarTitle textColor='#ddd' label='Timeline'>
          <CalendarArrowControl
            firstMonthLang={firstMonthLang}
            lastMonthLang={lastMonthLang}
            goInThePast={props.goInThePast}
            goInTheFuture={props.goInTheFuture}
          />
        </CalendarTitle>
      </div>

      <div className='overflow-y-auto'>
        {!props.isLoading ? (
          props.allCalendars.map((calendar, index) => (
            <div key={index}>
              <Timeline
                fromDate={props.fromDate}
                numDaysToShow={props.numDaysToShow}
                calendar={calendar}
                pleaseUpdateCalendar={() => {
                  props.pleaseUpdateCalendar(calendar.id)
                }}
              />
            </div>
          ))
        ) : (
          <>Searching...</>
        )}
      </div>
    </>
  )
}
