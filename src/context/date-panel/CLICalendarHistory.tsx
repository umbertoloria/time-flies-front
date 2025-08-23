import { FC, useEffect } from 'react'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '../../components/calendar/event-calendar-updated.ts'
import { Badge } from '../../components/calendar/Badge.tsx'
import {
  StreamlineBoxCalendar,
  StreamlineBoxDate,
  StreamlinePre,
  StreamlineTodo,
} from '../../components/streamline/StreamlineStateless.tsx'
import { getSDK } from '../../remote/remote.ts'
import { periodRefreshDateInMillis } from './DatePanelCLI.tsx'
import { TCalendar } from '../../remote/sdk/types'

const { readCalendar } = getSDK()
export const CLICalendarHistory: FC<{
  calendarId: number
}> = ({ calendarId }) => {
  const [data, { refetch: refreshCalendar }] = useWrapperForCreateResource(() =>
    readCalendar(calendarId).then(response =>
      typeof response === 'object' ? response : undefined
    )
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

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Loading...</Badge>
        </>
      )}
      {!data?.loading && !!data?.data && (
        <>
          <CLICalendarHistoryStateless
            calendar={data.data}
            refreshCalendar={refreshCalendar}
          />
        </>
      )}
    </>
  )
}
const CLICalendarHistoryStateless: FC<{
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
    <>
      <StreamlinePre>
        <StreamlineBoxCalendar
          spacesOffset={0}
          calendarColor={calendar.color}
          calendarName={calendar.name}
        />
        {calendar.days.map((date, index) => (
          <>
            <StreamlineBoxDate
              //
              key={index}
              spacesOffset={2}
              date={date.date}
            />
            <StreamlineTodo
              calendar={calendar}
              date={date.date}
              mode={{
                type: 'done-task',
                doneTask: {
                  notes: date.notes,
                },
              }}
            />
            {'\n'}
          </>
        ))}
      </StreamlinePre>
    </>
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
