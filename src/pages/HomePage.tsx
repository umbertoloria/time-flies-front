import { FC, useEffect, useState } from 'react'
import {
  getDateFromLocalDate,
  getDateWithOffsetDays,
  getTodayLocalDate,
} from '../lib/utils.ts'
import { UserLayout } from '../layout/UserLayout.tsx'
import { getSDK } from '../remote/remote.ts'
import { CalendarGridListening } from '../components/calendar/CalendarGrid.tsx'
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

// One month prior, one week future
const defaultCalendarsNumWeeks = 5
const defaultCalendarsWeeksInAdvance = 1
const defaultTimelinesNumDaysBefore = 38

const { readAllCalendars } = getSDK()
const InnerPage: FC = () => {
  const todayLocalDate = getTodayLocalDate()

  // Calendars: 4 weeks offsets
  const [calendar2monthsOffset, setCalendar2monthsOffset] = useState<
    Record<number, number | undefined>
  >({})
  const getWeeks4OffsetFromCalendar = (calendarId: number) =>
    calendar2monthsOffset[calendarId] || 0
  const getCalendarFromDate = (calendarId: number) =>
    getDateWithOffsetDays(
      getDateFromLocalDate(todayLocalDate),
      -7 *
        (defaultCalendarsNumWeeks -
          1 -
          defaultCalendarsWeeksInAdvance +
          4 * getWeeks4OffsetFromCalendar(calendarId))
    )
  const setWeeks4OffsetForCalendar = (calendarId: number, value: number) =>
    setCalendar2monthsOffset(old => ({
      ...old,
      [calendarId]: value,
    }))
  const addCalendarMonthsOffset = (id: number, amount: number) => {
    setWeeks4OffsetForCalendar(id, getWeeks4OffsetFromCalendar(id) + amount)
  }

  // Timelines: 4 weeks before
  const [timelinesWeeksBefore, setTimelinesWeeksBefore] = useState(0)
  const timelinesFromDate = (() => {
    const timelinesEndDate = getDateFromLocalDate(todayLocalDate)
    timelinesEndDate.setDate(
      timelinesEndDate.getDate() - timelinesWeeksBefore * 7
    )
    return getDateWithOffsetDays(
      timelinesEndDate,
      -defaultTimelinesNumDaysBefore
    )
  })()
  const timelinesNumDaysToShow = defaultTimelinesNumDaysBefore + 1 // Days before (in the past) plus today.

  // Calendars
  const [dataAllCalendars, { refetch: refetchAllCalendars }] =
    useWrapperForCreateResource(() => {
      return readAllCalendars()
    })
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refetchOneCalendar = (calendarId: number) => {
    // TODO: Improve partial loadings
    refetchAllCalendars()
  }
  useEffect(() => {
    const refreshCalendarIntervalTimer = setInterval(() => {
      refetchAllCalendars()
    }, periodRefreshCalendarsInMillis)
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
              <CalendarGridListening
                calendar={calendar}
                startWeekFromDate={getCalendarFromDate(calendar.id)}
                numWeeks={defaultCalendarsNumWeeks}
                pleaseUpdateCalendar={() => {
                  refetchOneCalendar(calendar.id)
                }}
                goInThePast={() => {
                  addCalendarMonthsOffset(calendar.id, 1)
                }}
                goInTheFuture={() => {
                  addCalendarMonthsOffset(calendar.id, -1)
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
          fromDate={timelinesFromDate}
          numDaysToShow={timelinesNumDaysToShow}
          allCalendars={dataAllCalendars.data.calendars}
          isLoading={dataAllCalendars.loading}
          goInThePast={() => {
            setTimelinesWeeksBefore(timelinesWeeksBefore + 1)
          }}
          goInTheFuture={() => {
            setTimelinesWeeksBefore(timelinesWeeksBefore - 1)
          }}
          pleaseUpdateCalendar={calendarId => {
            refetchOneCalendar(calendarId)
          }}
        />
      )}
    </section>
  )
}
