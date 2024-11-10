import { FC, useState } from 'react'
import {
  CalendarArrowControl,
  CalendarLineProps,
  CalendarTitle,
} from '../calendar/Calendar.tsx'
import { TCalendar } from '../../remote/sdk/types'
import { getITMonthFromLocalDate, getTodayDate } from '../../lib/utils.ts'
import { getFirstAndLastLocalDatesFromCalendarLines } from '../calendar/utils.ts'
import { createCalendarCellPropsList, Timeline } from './Timeline.tsx'

type TimelinesDataCalendar = TCalendar & {
  loading: boolean
}
export const Timelines: FC<{
  dataCalendar1: TimelinesDataCalendar
  dataCalendar2: TimelinesDataCalendar
  dataCalendar3: TimelinesDataCalendar
  dataCalendar4: TimelinesDataCalendar
  dataCalendar5: TimelinesDataCalendar
  pleaseUpdateCalendar: (calendarId: number) => void
}> = ({
  dataCalendar1,
  dataCalendar2,
  dataCalendar3,
  dataCalendar4,
  dataCalendar5,
  pleaseUpdateCalendar,
}) => {
  const [numDaysBefore] = useState(38)
  const [weeks4Before, setWeeks4Before] = useState(0)
  const endDate = (() => {
    const todayDate = getTodayDate()
    todayDate.setDate(todayDate.getDate() - weeks4Before * 7)
    return todayDate
  })()

  const calendarCells = createCalendarCellPropsList(
    endDate,
    numDaysBefore,
    dataCalendar1
  )
  const calendarLines: CalendarLineProps[] = [{ cells: calendarCells }]
  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromCalendarLines(calendarLines)
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
        {dataCalendar1?.loading === false ? (
          <>
            <Timeline
              endDate={endDate}
              numDaysBefore={numDaysBefore}
              calendar={dataCalendar1}
              pleaseUpdateCalendar={() => {
                pleaseUpdateCalendar(1)
              }}
            />
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar2?.loading === false ? (
          <>
            <Timeline
              endDate={endDate}
              numDaysBefore={numDaysBefore}
              calendar={dataCalendar2}
              pleaseUpdateCalendar={() => {
                pleaseUpdateCalendar(2)
              }}
            />
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar3?.loading === false ? (
          <>
            <Timeline
              endDate={endDate}
              numDaysBefore={numDaysBefore}
              calendar={dataCalendar3}
              pleaseUpdateCalendar={() => {
                pleaseUpdateCalendar(3)
              }}
            />
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar4?.loading === false ? (
          <>
            <Timeline
              endDate={endDate}
              numDaysBefore={numDaysBefore}
              calendar={dataCalendar4}
              pleaseUpdateCalendar={() => {
                pleaseUpdateCalendar(4)
              }}
            />
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar5?.loading === false ? (
          <>
            <Timeline
              endDate={endDate}
              numDaysBefore={numDaysBefore}
              calendar={dataCalendar5}
              pleaseUpdateCalendar={() => {
                pleaseUpdateCalendar(5)
              }}
            />
          </>
        ) : (
          <>Searching...</>
        )}
      </div>
    </>
  )
}
