import { FC, useEffect, useMemo, useState } from 'react'
import {
  getDateFromLocalDate,
  getDateWithOffsetDays,
  getLocalDayByDate,
  getTodayLocalDate,
  localDatesLT,
} from '../lib/utils.ts'
import { UserLayout } from '../layout/UserLayout.tsx'
import { getSDK } from '../remote/remote.ts'
import { LogicCalendarGridListening } from '../components/calendar/CalendarGrid.tsx'
import { useWrapperForCreateResource } from '../lib/remote-resources.ts'
import { Streamline } from '../components/streamline/Streamline.tsx'
import {
  defaultTimelinesNumDaysBefore,
  Timelines,
} from '../components/timeline/Timelines.tsx'
import { moveDateToClosestNonFutureMonday } from '../components/calendar/utils.ts'
import { createLogicCalendarFromTCalendar } from '../components/calendar/logic-calendar.ts'

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

const { readAllCalendars } = getSDK()
const InnerPage: FC = () => {
  const todayLocalDate = getTodayLocalDate()

  // Calendars: 4 weeks offsets
  const [calendar2monthsOffset, setCalendar2monthsOffset] = useState<
    Record<number, number | undefined>
  >({})
  const getCalendarFromDateMonday = (calendarId: number) =>
    moveDateToClosestNonFutureMonday(
      getDateWithOffsetDays(
        getDateFromLocalDate(todayLocalDate),
        -7 *
          (defaultCalendarsNumWeeks -
            1 -
            defaultCalendarsWeeksInAdvance +
            4 * (calendar2monthsOffset[calendarId] || 0))
      )
    )
  const addCalendarMonthsOffset = (calendarId: number, amount: number) => {
    setCalendar2monthsOffset(old => ({
      ...old,
      [calendarId]: (old[calendarId] || 0) + amount,
    }))
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
  // Calculated "Minimum From Date"
  const minFromDate = useMemo(() => {
    let result = todayLocalDate
    // Calendars (default dates): always mondays
    const calendarDefaultFromDateMonday = getLocalDayByDate(
      getCalendarFromDateMonday(-1) // Fake Calendar ID
    )
    if (localDatesLT(calendarDefaultFromDateMonday, result)) {
      result = calendarDefaultFromDateMonday
    }
    // Calendars (custom dates): always mondays
    for (const strCalendarId of Object.keys(calendar2monthsOffset)) {
      const calendarId = parseInt(strCalendarId)
      const calendarFromDateMonday = getLocalDayByDate(
        getCalendarFromDateMonday(calendarId)
      )
      if (localDatesLT(calendarFromDateMonday, result)) {
        result = calendarFromDateMonday
      }
    }
    // Timelines: *not* always mondays
    const timelinesFromLocalDate = getLocalDayByDate(timelinesFromDate)
    if (localDatesLT(timelinesFromLocalDate, result)) {
      result = timelinesFromLocalDate
    }
    return result
  }, [calendar2monthsOffset, timelinesWeeksBefore])

  // Calendars
  const [dataAllCalendars, { refetch: refetchAllCalendars }] =
    useWrapperForCreateResource(() => {
      return readAllCalendars({
        dateFrom: minFromDate,
      })
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
  useEffect(() => {
    refetchAllCalendars()
  }, [minFromDate])

  return (
    <section className='p-8'>
      <div className='main-section-grids'>
        {/* All Calendars Grids */}
        {!dataAllCalendars?.loading && !!dataAllCalendars?.data ? (
          dataAllCalendars.data.calendars.map((calendar, index) => (
            <div key={index}>
              <LogicCalendarGridListening
                logicCalendar={createLogicCalendarFromTCalendar(calendar)}
                fromDateMonday={getCalendarFromDateMonday(calendar.id)}
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

        {/* Timelines Grids */}
        {!!dataAllCalendars?.data && (
          <Timelines
            fromDate={timelinesFromDate}
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

        {/* Streamline */}
        <Streamline />
      </div>
    </section>
  )
}
