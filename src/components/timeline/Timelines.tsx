import { FC } from 'react'
import { Badge } from '@/components/calendar/Badge'
import {
  CalendarArrowControl,
  CalendarGridStatelessListening,
  CalendarTitle,
} from '@/components/calendar/CalendarGrid'
import { createLogicCalendarFromTCalendar } from '@/components/calendar/logic-calendar'
import { getFirstAndLastLocalDatesFromDayStatusRows } from '@/components/calendar/utils'
import { createDayStatusPropsListFromLogicCalendar } from '@/components/timeline/timeline-utils'
import { TCalendarPrev } from '@/remote/sdk/types'
import { getITMonthFromLocalDate } from '@/lib/utils'

export const defaultTimelinesNumDaysBefore = 14 // 14 days before + today => correct "width"

export const Timelines: FC<{
  fromDate: Date
  allCalendars: TCalendarPrev[]
  isLoading: boolean
  goInThePast: () => void
  goInTheFuture: () => void
  pleaseUpdateCalendar: (calendarId: number) => void
}> = props => {
  const numDaysToShow = defaultTimelinesNumDaysBefore + 1 // before + today
  if (props.allCalendars.length < 1) {
    return <></>
  }

  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromDayStatusRows([
      {
        dayStatuses: createDayStatusPropsListFromLogicCalendar(
          createLogicCalendarFromTCalendar(props.allCalendars[0]),
          props.fromDate,
          numDaysToShow
        ),
      },
    ])
  const firstMonthLang = getITMonthFromLocalDate(firstLocalDate)
  const lastMonthLang = getITMonthFromLocalDate(lastLocalDate)

  return (
    <div className='timelines-grids'>
      <div className='w-full text-center'>
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
              <CalendarGridStatelessListening
                dayStatusRows={[
                  {
                    dayStatuses: createDayStatusPropsListFromLogicCalendar(
                      createLogicCalendarFromTCalendar(calendar),
                      props.fromDate,
                      numDaysToShow
                    ),
                  },
                ]}
                pleaseUpdateCalendar={() => {
                  props.pleaseUpdateCalendar(calendar.id)
                }}
              />
            </div>
          ))
        ) : (
          <Badge>Caricamento...</Badge>
        )}
      </div>
    </div>
  )
}
