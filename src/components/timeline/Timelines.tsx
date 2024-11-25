import { FC, useState } from 'react'
import { CalendarArrowControl, CalendarTitle } from '../calendar/Calendar.tsx'
import { TCalendar } from '../../remote/sdk/types'
import { getITMonthFromLocalDate, getTodayDate } from '../../lib/utils.ts'
import { getFirstAndLastLocalDatesFromDayStatusRows } from '../calendar/utils.ts'
import { Timeline } from './Timeline.tsx'
import { createDayStatusesFromTCalendar } from './timeline-utils.ts'

export const Timelines: FC<{
  allCalendars: TCalendar[]
  isLoading: boolean
  pleaseUpdateCalendar: (calendarId: number) => void
}> = props => {
  const [numDaysBefore] = useState(38)
  const [weeks4Before, setWeeks4Before] = useState(0)
  const endDate = (() => {
    const todayDate = getTodayDate()
    todayDate.setDate(todayDate.getDate() - weeks4Before * 7)
    return todayDate
  })()

  if (props.allCalendars.length < 1) {
    return <></>
  }

  const dayStatuses = createDayStatusesFromTCalendar(
    endDate,
    numDaysBefore,
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
              setWeeks4Before(weeks4Before + 1)
            }}
            goInTheFuture={() => {
              setWeeks4Before(weeks4Before - 1)
            }}
          />
        </CalendarTitle>
      </div>

      <div className='overflow-y-auto'>
        {!props.isLoading ? (
          props.allCalendars.map((calendar, index) => (
            <div key={index}>
              <Timeline
                endDate={endDate}
                numDaysBefore={numDaysBefore}
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
