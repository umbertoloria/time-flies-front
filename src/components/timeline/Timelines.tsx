import { FC, useState } from 'react'
import { CalendarTitle } from '../calendar/Calendar.tsx'
import { Timeline } from './Timeline.tsx'
import { TCalendar } from '../../remote/sdk/types'

type TimelinesDataCalendar = TCalendar & {
  loading: boolean
}

export const Timelines: FC<{
  nowLocalDate: string
  dataCalendar1?: TimelinesDataCalendar
  dataCalendar2?: TimelinesDataCalendar
  dataCalendar3?: TimelinesDataCalendar
  dataCalendar4?: TimelinesDataCalendar
  dataCalendar5?: TimelinesDataCalendar
}> = ({
  nowLocalDate,
  dataCalendar1,
  dataCalendar2,
  dataCalendar3,
  dataCalendar4,
  dataCalendar5,
}) => {
  const [endDate] = useState(new Date(nowLocalDate))
  const [numDaysBefore] = useState(38)

  return (
    <>
      <div className='pt-2 w-full text-center'>
        <CalendarTitle textColor='#ddd' label='Timeline' />
      </div>
      {dataCalendar1?.loading === false ? (
        <>
          <Timeline
            endDate={endDate}
            numDaysBefore={numDaysBefore}
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
            calendar={dataCalendar5}
          />
        </>
      ) : (
        <>Searching...</>
      )}
    </>
  )
}
