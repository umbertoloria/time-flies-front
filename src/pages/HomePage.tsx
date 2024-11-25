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
import { createLogicCalendarFromTCalendar } from '../components/calendar/logic-calendar.ts'
import { useWrapperForCreateResource } from '../lib/remote-resources.ts'
import { Streamline } from '../components/streamline/Streamline.tsx'
import { Timelines } from '../components/timeline/Timelines.tsx'

const periodRefreshCalendarsInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function HomePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const numWeeks = defaultNumWeeks

const { readAllCalendars } = getSDK()
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
  const [dataAllCalendars, { refetch: refetchAllCalendars }] =
    useWrapperForCreateResource(() => readAllCalendars())
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refetchOneCalendar = (calendarId: number) => {
    // TODO: Improve partial loadings
    refetchAllCalendars()
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
        {!dataAllCalendars?.loading && !!dataAllCalendars?.data ? (
          dataAllCalendars.data.calendars.map((calendar, index) => (
            <div key={index}>
              <CalendarForLogicCalendar
                startWeekFromDate={getFromDateForCalendar(calendar.id)}
                numWeeks={numWeeks}
                logicCalendar={createLogicCalendarFromTCalendar(calendar)}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(calendar.id)
                }}
                goInThePast={() => {
                  setWeeks4InThePastForCalendar(calendar.id)
                }}
                goInTheFuture={() => {
                  setWeeks4InTheFutureForCalendar(calendar.id)
                }}
              />
            </div>
          ))
        ) : (
          <>Searching...</>
        )}

        <div>
          <Streamline />
        </div>
      </div>

      {!!dataAllCalendars?.data && (
        <Timelines
          allCalendars={dataAllCalendars.data.calendars}
          isLoading={dataAllCalendars.loading}
          pleaseUpdateCalendar={refetchOneCalendar}
        />
      )}
    </section>
  )
}
