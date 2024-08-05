import { getDayCodeByDate, getNowDate } from '../lib/utils.ts'
import { useEffect, useState } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { readCalendar } from '../remote/remote.ts'
import { getDateWithOffsetDays } from '../components/calendar/utils.ts'
import { Calendar, CalendarTitle } from '../components/calendar/Calendar.tsx'
import { Timeline } from '../components/timeline/Timeline.tsx'

const defaultNumWeeks = 4 * 3 // Three months
const periodRefreshCalendarsInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

const useWrapperForCreateResource = <T,>(
  id: number,
  fn: (id: number) => Promise<T>
): [
  data:
    | undefined
    | (T & {
        loading: boolean
      }),
  {
    refetch: () => void
  },
] => {
  // TODO: Improve mapping
  const [data, setData] = useState<T | undefined>(undefined)

  const fnfn = () => {
    setData(data => (data ? { ...data, loading: true } : undefined))
    fn(id)
      .then(data => {
        setData({ ...data, loading: false })
      })
      .catch(err => {
        setData(data => (data ? { ...data, loading: false } : undefined))
        console.error(err)
      })
  }

  useEffect(() => {
    fnfn()
  }, [])

  return [
    data
      ? {
          loading: false,
          ...data,
        }
      : undefined,
    {
      refetch: () => {
        fnfn()
      },
    },
  ]
}

export default function Home() {
  const nowDate = getNowDate()
  const nowLocalDate = getDayCodeByDate(nowDate)

  const [numWeeks] = useState(defaultNumWeeks)
  const [endDate] = useState(new Date(nowLocalDate))
  const [numDaysBefore] = useState(38)

  const fromDate = getDateWithOffsetDays(
    new Date(nowLocalDate),
    -(numWeeks * 7)
  )

  // Calendars
  const [dataCalendar1, { refetch: refetchCalendar1 }] =
    useWrapperForCreateResource(1, readCalendar)
  const [dataCalendar2, { refetch: refetchCalendar2 }] =
    useWrapperForCreateResource(2, readCalendar)
  const [dataCalendar3, { refetch: refetchCalendar3 }] =
    useWrapperForCreateResource(3, readCalendar)
  const [dataCalendar4, { refetch: refetchCalendar4 }] =
    useWrapperForCreateResource(4, readCalendar)
  const [dataCalendar5, { refetch: refetchCalendar5 }] =
    useWrapperForCreateResource(5, readCalendar)

  const refreshCalendarIntervalTimer = setInterval(() => {
    refetchCalendar1()
    refetchCalendar2()
    refetchCalendar3()
    refetchCalendar4()
    refetchCalendar5()
  }, periodRefreshCalendarsInMillis)
  useEffect(() => {
    return () => {
      clearInterval(refreshCalendarIntervalTimer)
    }
  }, [])

  return (
    <UserLayout>
      <section className=' p-8'>
        <div className='flex justify-center gap-10'>
          {dataCalendar1?.loading === false ? (
            <>
              <div>
                <Calendar
                  startWeekFromDate={fromDate}
                  numWeeks={numWeeks}
                  calendar={dataCalendar1}
                  goInThePast={() => {
                    console.log('goInThePast')
                  }}
                  goInTheFuture={() => {
                    console.log('goInTheFuture')
                  }}
                />
              </div>
            </>
          ) : (
            <>Searching...</>
          )}

          {dataCalendar2?.loading === false ? (
            <>
              <div>
                <Calendar
                  startWeekFromDate={fromDate}
                  numWeeks={numWeeks}
                  calendar={dataCalendar2}
                  goInThePast={() => {
                    console.log('goInThePast')
                  }}
                  goInTheFuture={() => {
                    console.log('goInTheFuture')
                  }}
                />
              </div>
            </>
          ) : (
            <>Searching...</>
          )}

          {dataCalendar3?.loading === false ? (
            <>
              <div>
                <Calendar
                  startWeekFromDate={fromDate}
                  numWeeks={numWeeks}
                  calendar={dataCalendar3}
                  goInThePast={() => {
                    console.log('goInThePast')
                  }}
                  goInTheFuture={() => {
                    console.log('goInTheFuture')
                  }}
                />
              </div>
            </>
          ) : (
            <>Searching...</>
          )}

          {dataCalendar4?.loading === false ? (
            <>
              <div>
                <Calendar
                  startWeekFromDate={fromDate}
                  numWeeks={numWeeks}
                  calendar={dataCalendar4}
                  goInThePast={() => {
                    console.log('goInThePast')
                  }}
                  goInTheFuture={() => {
                    console.log('goInTheFuture')
                  }}
                />
              </div>
            </>
          ) : (
            <>Searching...</>
          )}

          {dataCalendar5?.loading === false ? (
            <>
              <div>
                <Calendar
                  startWeekFromDate={fromDate}
                  numWeeks={numWeeks}
                  calendar={dataCalendar5}
                  goInThePast={() => {
                    console.log('goInThePast')
                  }}
                  goInTheFuture={() => {
                    console.log('goInTheFuture')
                  }}
                />
              </div>
            </>
          ) : (
            <>Searching...</>
          )}
        </div>

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
      </section>
    </UserLayout>
  )
}
