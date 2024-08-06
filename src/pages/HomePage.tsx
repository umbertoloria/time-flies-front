import {
  getDateFromLocalDate,
  getLocalDayByDate,
  getNowDate,
} from '../lib/utils.ts'
import { useEffect, useState } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { readCalendar } from '../remote/remote.ts'
import { getDateWithOffsetDays } from '../components/calendar/utils.ts'
import { Calendar } from '../components/calendar/Calendar.tsx'
import { Timelines } from '../components/timeline/Timelines.tsx'

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
  const nowLocalDate = getLocalDayByDate(nowDate)

  // Calendars
  const [numWeeks] = useState(defaultNumWeeks)

  const [weeks4Before1, setWeeks4Before1] = useState(0)
  const [weeks4Before2, setWeeks4Before2] = useState(0)
  const [weeks4Before3, setWeeks4Before3] = useState(0)
  const [weeks4Before4, setWeeks4Before4] = useState(0)
  const [weeks4Before5, setWeeks4Before5] = useState(0)

  const fromDate1 = getDateWithOffsetDays(
    getDateFromLocalDate(nowLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before1)
  )
  const fromDate2 = getDateWithOffsetDays(
    getDateFromLocalDate(nowLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before2)
  )
  const fromDate3 = getDateWithOffsetDays(
    getDateFromLocalDate(nowLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before3)
  )
  const fromDate4 = getDateWithOffsetDays(
    getDateFromLocalDate(nowLocalDate),
    -7 * (numWeeks - 1 + 4 * weeks4Before4)
  )
  const fromDate5 = getDateWithOffsetDays(
    getDateFromLocalDate(nowLocalDate),
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
    <UserLayout>
      <section className=' p-8'>
        <div className='flex justify-center gap-10'>
          {dataCalendar1?.loading === false ? (
            <>
              <div>
                <Calendar
                  startWeekFromDate={fromDate1}
                  numWeeks={numWeeks}
                  calendar={dataCalendar1}
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
              nowLocalDate={nowLocalDate}
              dataCalendar1={dataCalendar1}
              dataCalendar2={dataCalendar2}
              dataCalendar3={dataCalendar3}
              dataCalendar4={dataCalendar4}
              dataCalendar5={dataCalendar5}
            />
          )}
      </section>
    </UserLayout>
  )
}
