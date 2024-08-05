import { FC, useState } from 'react'
import { CalendarArrowControl, CalendarTitle } from '../calendar/Calendar.tsx'
import { TCalendar } from '../../remote/sdk/types'
import { getITMonthFromLocalDate } from '../../lib/utils.ts'
import { getFirstAndLastLocalDatesFromCalendarLines } from '../calendar/utils.ts'
import { createCalendarLinePropsList, Timeline } from './Timeline.tsx'

type TimelinesDataCalendar = TCalendar & {
  loading: boolean
}

export const Timelines: FC<{
  nowLocalDate: string
  dataCalendar1: TimelinesDataCalendar
  dataCalendar2: TimelinesDataCalendar
  dataCalendar3: TimelinesDataCalendar
  dataCalendar4: TimelinesDataCalendar
  dataCalendar5: TimelinesDataCalendar
}> = ({
  nowLocalDate,
  dataCalendar1,
  dataCalendar2,
  dataCalendar3,
  dataCalendar4,
  dataCalendar5,
}) => {
  const nowDate = new Date(nowLocalDate)
  const [numDaysBefore] = useState(38)
  const [weeks4Before, setWeeks4Before] = useState(0)
  const endDate = (() => {
    const clone = new Date(nowDate)
    clone.setDate(clone.getDate() - weeks4Before * 7)
    return clone
  })()

  const calendarLines = createCalendarLinePropsList(
    endDate,
    numDaysBefore,
    dataCalendar1,
    nowDate,
    dataCalendar1.color
  )
  if (!calendarLines.length) {
    throw new Error('First calendar was empty')
  }
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
      {dataCalendar1?.loading === false ? (
        <>
          <Timeline
            endDate={endDate}
            numDaysBefore={numDaysBefore}
            nowDate={nowDate}
            calendar={dataCalendar1}
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
            nowDate={nowDate}
            calendar={dataCalendar2}
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
            nowDate={nowDate}
            calendar={dataCalendar3}
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
            nowDate={nowDate}
            calendar={dataCalendar4}
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
            nowDate={nowDate}
            calendar={dataCalendar5}
          />
        </>
      ) : (
        <>Searching...</>
      )}
    </>
  )
}
