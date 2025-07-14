import { FC } from 'react'
import {
  CalendarArrowControl,
  CalendarTitle,
} from '../calendar/CalendarGrid.tsx'
import { TCalendar } from '../../remote/sdk/types'
import {
  getDateWithOffsetDays,
  getITMonthFromLocalDate,
} from '../../lib/utils.ts'
import { getFirstAndLastLocalDatesFromDayStatusRows } from '../calendar/utils.ts'
import { Timeline } from './Timeline.tsx'
import { createDayStatusPropsListFromLogicCalendar } from './timeline-utils.ts'
import { createLogicCalendarFromTCalendar } from '../calendar/logic-calendar.ts'

const defaultTimelinesNumDaysBefore = 38
export const Timelines: FC<{
  endDate: Date
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
          getDateWithOffsetDays(props.endDate, -defaultTimelinesNumDaysBefore),
          defaultTimelinesNumDaysBefore + 1 // "numDaysBefore + 1" meaning plus today.
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
                endDate={props.endDate}
                numDaysBefore={defaultTimelinesNumDaysBefore}
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
