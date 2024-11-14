import { FC, useEffect, useState } from 'react'
import {
  getDateFromLocalDate,
  getDateWithOffsetDays,
  getTodayLocalDate,
} from '../lib/utils.ts'
import { UserLayout } from '../layout/UserLayout.tsx'
import { readCalendar } from '../remote/remote.ts'
import { Calendar } from '../components/calendar/Calendar.tsx'
import { Timelines } from '../components/timeline/Timelines.tsx'

const defaultNumWeeks = 4 * 3 // Three months
const periodRefreshCalendarsInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export const useWrapperForCreateResource = <T,>(
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

export default function HomePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const InnerPage: FC = () => {
  const todayLocalDate = getTodayLocalDate()

  // Calendars
  const [numWeeks] = useState(defaultNumWeeks)

  const [weeks4Before1, setWeeks4Before1] = useState(0)
  const [weeks4Before2, setWeeks4Before2] = useState(0)
  const [weeks4Before3, setWeeks4Before3] = useState(0)
  const [weeks4Before4, setWeeks4Before4] = useState(0)
  const [weeks4Before5, setWeeks4Before5] = useState(0)

  const fromDate1 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before1)
  )
  const fromDate2 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before2)
  )
  const fromDate3 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before3)
  )
  const fromDate4 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before4)
  )
  const fromDate5 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before5)
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
    <section className='p-8'>
      <div className='flex flex-wrap justify-center gap-10 w-100'>
        {dataCalendar1?.loading === false ? (
          <>
            <div>
              <Calendar
                startWeekFromDate={fromDate1}
                numWeeks={numWeeks}
                calendar={dataCalendar1}
                pleaseUpdateCalendar={refetchCalendar1}
                goInThePast={() => {
                  setWeeks4Before1(weeks4Before1 + 1)
                }}
                goInTheFuture={() => {
                  setWeeks4Before1(weeks4Before1 - 1)
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
                startWeekFromDate={fromDate2}
                numWeeks={numWeeks}
                calendar={dataCalendar2}
                pleaseUpdateCalendar={refetchCalendar2}
                goInThePast={() => {
                  setWeeks4Before2(weeks4Before2 + 1)
                }}
                goInTheFuture={() => {
                  setWeeks4Before2(weeks4Before2 - 1)
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
                startWeekFromDate={fromDate3}
                numWeeks={numWeeks}
                calendar={dataCalendar3}
                pleaseUpdateCalendar={refetchCalendar3}
                goInThePast={() => {
                  setWeeks4Before3(weeks4Before3 + 1)
                }}
                goInTheFuture={() => {
                  setWeeks4Before3(weeks4Before3 - 1)
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
                startWeekFromDate={fromDate4}
                numWeeks={numWeeks}
                calendar={dataCalendar4}
                pleaseUpdateCalendar={refetchCalendar4}
                goInThePast={() => {
                  setWeeks4Before4(weeks4Before4 + 1)
                }}
                goInTheFuture={() => {
                  setWeeks4Before4(weeks4Before4 - 1)
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
                startWeekFromDate={fromDate5}
                numWeeks={numWeeks}
                calendar={dataCalendar5}
                pleaseUpdateCalendar={refetchCalendar5}
                goInThePast={() => {
                  setWeeks4Before5(weeks4Before5 + 1)
                }}
                goInTheFuture={() => {
                  setWeeks4Before5(weeks4Before5 - 1)
                }}
              />
            </div>
          </>
        ) : (
          <>Searching...</>
        )}
      </div>

      {!!dataCalendar1 &&
        !!dataCalendar2 &&
        !!dataCalendar3 &&
        !!dataCalendar4 &&
        !!dataCalendar5 && (
          <Timelines
            dataCalendar1={dataCalendar1}
            dataCalendar2={dataCalendar2}
            dataCalendar3={dataCalendar3}
            dataCalendar4={dataCalendar4}
            dataCalendar5={dataCalendar5}
            pleaseUpdateCalendar={calendarId => {
              // TODO: Improve this
              if (calendarId === 1) {
                refetchCalendar1()
              } else if (calendarId === 2) {
                refetchCalendar2()
              } else if (calendarId === 3) {
                refetchCalendar3()
              } else if (calendarId === 4) {
                refetchCalendar4()
              } else if (calendarId === 5) {
                refetchCalendar5()
              } else {
                // No support for other calendars...
              }
            }}
          />
        )}
    </section>
  )
}
