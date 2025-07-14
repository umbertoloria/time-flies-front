import { FC } from 'react'
import {
  CalendarArrowControl,
  CalendarTitle,
} from '../calendar/CalendarGrid.tsx'
import { TCalendar } from '../../remote/sdk/types'
import { getITMonthFromLocalDate } from '../../lib/utils.ts'
import { getFirstAndLastLocalDatesFromDayStatusRows } from '../calendar/utils.ts'
import { Timeline } from './Timeline.tsx'
import { createDayStatusesFromTCalendar } from './timeline-utils.ts'

const defaultTimelinesNumDaysBefore = 38
export const Timelines: FC<{
  endDate: Date
  weeks4Before: number
  setWeeks4Before: (value: number) => void
  allCalendars: TCalendar[]
  isLoading: boolean
  pleaseUpdateCalendar: (calendarId: number) => void
}> = props => {
  if (props.allCalendars.length < 1) {
    return <></>
  }

  const dayStatuses = createDayStatusesFromTCalendar(
    props.endDate,
    defaultTimelinesNumDaysBefore,
    props.allCalendars[0]
  )
  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromDayStatusRows([{ dayStatuses }])
  const firstMonthLang = getITMonthFromLocalDate(firstLocalDate)
  const lastMonthLang = getITMonthFromLocalDate(lastLocalDate)

  return (
    <>
      <div className='pt-2 w-full text-center'>
        <CalendarTitle textColor='#ddd' label='Timeline'>
          <CalendarArrowControl
            firstMonthLang={firstMonthLang}
            lastMonthLang={lastMonthLang}
            goInThePast={() => {
              props.setWeeks4Before(props.weeks4Before + 1)
            }}
            goInTheFuture={() => {
              props.setWeeks4Before(props.weeks4Before - 1)
            }}
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
