import { FC, useEffect, useState } from 'react'
import {
  getDateFromLocalDate,
  getDateWithOffsetDays,
  getTodayLocalDate,
} from '../lib/utils.ts'
import { UserLayout } from '../layout/UserLayout.tsx'
import { getSDK } from '../remote/remote.ts'
import {
  CalendarForLogicCalendar,
  defaultNumWeeks,
} from '../components/calendar/Calendar.tsx'
import { Timelines } from '../components/timeline/Timelines.tsx'
import { createLogicCalendarFromTCalendar } from '../components/calendar/logic-calendar.ts'
import { useWrapperForCreateResource } from '../lib/remote-resources.ts'
import { Streamline } from '../components/streamline/Streamline.tsx'
import { TCalendar } from '../remote/sdk/types'

const periodRefreshCalendarsInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function HomePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const numWeeks = defaultNumWeeks

const { readCalendar } = getSDK()
const InnerPage: FC = () => {
  const todayLocalDate = getTodayLocalDate()

  // Weeks 4 Offsets for calendars
  const [weeks4Offsets, setWeeks4Offsets] = useState<
    Record<number, number | undefined>
  >({})
  const getWeeks4OffsetFromCalendar = (id: number) => weeks4Offsets[id] || 0
  const setWeeks4OffsetForCalendar = (id: number, value: number) => {
    setWeeks4Offsets(old => ({
      ...old,
      [id]: value,
    }))
  }
  const setWeeks4InThePastForCalendar = (id: number) => {
    setWeeks4OffsetForCalendar(id, getWeeks4OffsetFromCalendar(id) + 1)
  }
  const setWeeks4InTheFutureForCalendar = (id: number) => {
    setWeeks4OffsetForCalendar(id, getWeeks4OffsetFromCalendar(id) - 1)
  }

  // Calculating "From Dates" for calendars
  const fromDate1 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * getWeeks4OffsetFromCalendar(1))
  )
  const fromDate2 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * getWeeks4OffsetFromCalendar(2))
  )
  const fromDate3 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * getWeeks4OffsetFromCalendar(3))
  )
  const fromDate4 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * getWeeks4OffsetFromCalendar(4))
  )
  const fromDate5 = getDateWithOffsetDays(
    getDateFromLocalDate(todayLocalDate),
    -7 * (numWeeks - 1 + 4 * getWeeks4OffsetFromCalendar(5))
  )

  // Calendars
  const safeCalendar = (data: TCalendar | 'unable') =>
    data === 'unable' ? undefined : data
  const [dataCalendar1, { refetch: refetchCalendar1 }] =
    useWrapperForCreateResource(() => readCalendar(1).then(safeCalendar))
  const [dataCalendar2, { refetch: refetchCalendar2 }] =
    useWrapperForCreateResource(() => readCalendar(2).then(safeCalendar))
  const [dataCalendar3, { refetch: refetchCalendar3 }] =
    useWrapperForCreateResource(() => readCalendar(3).then(safeCalendar))
  const [dataCalendar4, { refetch: refetchCalendar4 }] =
    useWrapperForCreateResource(() => readCalendar(4).then(safeCalendar))
  const [dataCalendar5, { refetch: refetchCalendar5 }] =
    useWrapperForCreateResource(() => readCalendar(5).then(safeCalendar))

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
        {dataCalendar1?.loading === false && !!dataCalendar1.data ? (
          <>
            <div>
              <CalendarForLogicCalendar
                startWeekFromDate={fromDate1}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar1.data
                )}
                pleaseUpdateCalendar={refetchCalendar1}
                goInThePast={() => {
                  setWeeks4InThePastForCalendar(1)
                }}
                goInTheFuture={() => {
                  setWeeks4InTheFutureForCalendar(1)
                }}
              />
            </div>
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar2?.loading === false && !!dataCalendar2.data ? (
          <>
            <div>
              <CalendarForLogicCalendar
                startWeekFromDate={fromDate2}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar2.data
                )}
                pleaseUpdateCalendar={refetchCalendar2}
                goInThePast={() => {
                  setWeeks4InThePastForCalendar(2)
                }}
                goInTheFuture={() => {
                  setWeeks4InTheFutureForCalendar(2)
                }}
              />
            </div>
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar3?.loading === false && !!dataCalendar3.data ? (
          <>
            <div>
              <CalendarForLogicCalendar
                startWeekFromDate={fromDate3}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar3.data
                )}
                pleaseUpdateCalendar={refetchCalendar3}
                goInThePast={() => {
                  setWeeks4InThePastForCalendar(3)
                }}
                goInTheFuture={() => {
                  setWeeks4InTheFutureForCalendar(3)
                }}
              />
            </div>
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar4?.loading === false && !!dataCalendar4.data ? (
          <>
            <div>
              <CalendarForLogicCalendar
                startWeekFromDate={fromDate4}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar4.data
                )}
                pleaseUpdateCalendar={refetchCalendar4}
                goInThePast={() => {
                  setWeeks4InThePastForCalendar(4)
                }}
                goInTheFuture={() => {
                  setWeeks4InTheFutureForCalendar(4)
                }}
              />
            </div>
          </>
        ) : (
          <>Searching...</>
        )}

        {dataCalendar5?.loading === false && !!dataCalendar5.data ? (
          <>
            <div>
              <CalendarForLogicCalendar
                startWeekFromDate={fromDate5}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar5.data
                )}
                pleaseUpdateCalendar={refetchCalendar5}
                goInThePast={() => {
                  setWeeks4InThePastForCalendar(5)
                }}
                goInTheFuture={() => {
                  setWeeks4InTheFutureForCalendar(5)
                }}
              />
            </div>
          </>
        ) : (
          <>Searching...</>
        )}

        <div>
          <Streamline />
        </div>
      </div>

      {!!dataCalendar1?.data &&
        !!dataCalendar2?.data &&
        !!dataCalendar3?.data &&
        !!dataCalendar4?.data &&
        !!dataCalendar5?.data && (
          <Timelines
            dataCalendar1={dataCalendar1.data}
            dataCalendar2={dataCalendar2.data}
            dataCalendar3={dataCalendar3.data}
            dataCalendar4={dataCalendar4.data}
            dataCalendar5={dataCalendar5.data}
            dataCalendar1Loading={dataCalendar1.loading}
            dataCalendar2Loading={dataCalendar2.loading}
            dataCalendar3Loading={dataCalendar3.loading}
            dataCalendar4Loading={dataCalendar4.loading}
            dataCalendar5Loading={dataCalendar5.loading}
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
