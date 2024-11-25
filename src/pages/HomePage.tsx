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
  const getFromDateForCalendar = (id: number) => {
    return getDateWithOffsetDays(
      getDateFromLocalDate(todayLocalDate),
      -7 * (numWeeks - 1 + 4 * getWeeks4OffsetFromCalendar(id))
    )
  }

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

  const refetchOneCalendar = (calendarId: number) => {
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
  }
  const refetchAllCalendars = () => {
    refetchOneCalendar(1)
    refetchOneCalendar(2)
    refetchOneCalendar(3)
    refetchOneCalendar(4)
    refetchOneCalendar(5)
  }
  const refreshCalendarIntervalTimer = setInterval(() => {
    refetchAllCalendars()
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
                startWeekFromDate={getFromDateForCalendar(1)}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar1.data
                )}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(1)
                }}
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
                startWeekFromDate={getFromDateForCalendar(2)}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar2.data
                )}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(2)
                }}
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
                startWeekFromDate={getFromDateForCalendar(3)}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar3.data
                )}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(3)
                }}
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
                startWeekFromDate={getFromDateForCalendar(4)}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar4.data
                )}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(4)
                }}
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
                startWeekFromDate={getFromDateForCalendar(5)}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(
                  dataCalendar5.data
                )}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(5)
                }}
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
              refetchOneCalendar(calendarId)
            }}
          />
        )}
    </section>
  )
}
