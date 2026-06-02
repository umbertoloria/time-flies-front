'use client'

import { FC, useEffect } from 'react'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '@/components/calendar/event-calendar-updated'
import { StreamlineNewCalendar2 } from '@/components/streamline/StreamlineStateless'
import { periodRefreshDateInMillis } from '@/context/date-panel/DatePanelCLI'
import { CustomEventFnType } from '@/events/event-builder'
import { useWrapperForCreateResource } from '@/lib/remote-resources'
import { getCalendarSDK } from '@/remote/remote'
import { TCalendar } from '@/remote/sdk/types'

const calendarSdk = getCalendarSDK()

export const useCalendarDownloader = (calendarId: number) => {
  const [data, { refetch: refreshCalendar }] = useWrapperForCreateResource(() =>
    calendarSdk
      .readCalendar(calendarId)
      .then(response => (typeof response === 'object' ? response : undefined))
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshCalendar,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [])
  useEffect(() => {
    refreshCalendar()
  }, [calendarId])
  return { data, refreshCalendar }
}

export const CLICalendarHistoryStateless: FC<{
  calendar: TCalendar
  refreshCalendar: () => void
}> = ({ calendar, refreshCalendar }) => {
  useEffect(() => {
    const listener: CustomEventFnType<
      CustomEventTypeCalendarUpdated
    > = event => {
      if (event.detail.calendarId === calendar.id) {
        refreshCalendar()
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])
  return (
    <div className='streamline-new'>
      <div className='streamline-new-date'>
        <StreamlineNewCalendar2 calendar={calendar} />
      </div>
    </div>
  )

  /*
  const allYears = calendar.days
    .map(day => getDateFromLocalDate(day.date).getFullYear())
    .filter(filterUnique)
  const todayYear = getTodayYear()

  if (allYears.length === 1) {
    return (
      <>
        <DiaryEntriesListAccordion
          initialOpen
          calendar={calendar}
          days={calendar.days}
          refreshDate={refreshCalendar}
        />
      </>
    )
  } else {
    const currentYearDates = calendar.days.filter(
      date => getDateFromLocalDate(date.date).getFullYear() === todayYear
    )
    const allPastYears = allYears.filter(year => year !== todayYear)
    return (
      <>
        {!!currentYearDates.length && (
          <DiaryEntriesListAccordion
            title={todayYear.toString()}
            initialOpen
            calendar={calendar}
            days={currentYearDates}
            refreshDate={refreshCalendar}
          />
        )}
        {allPastYears.map((year, index) => (
          <div key={index}>
            <DiaryEntriesListAccordion
              title={year.toString()}
              initialOpen={false}
              calendar={calendar}
              days={calendar.days.filter(
                date => getDateFromLocalDate(date.date).getFullYear() === year
              )}
              refreshDate={refreshCalendar}
            />
          </div>
        ))}
      </>
    )
  }
  */
}
