import { FC, useEffect } from 'react'
import { useDialogForDatePanel } from './ContextDialogForDatePanel.tsx'
import { Badge } from '../../components/calendar/Badge.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendar } from '../../remote/sdk/types'
import {
  StreamlineBoxCalendar,
  StreamlineBoxDate,
  StreamlinePre,
  StreamlineTodo,
} from '../../components/streamline/StreamlineStateless.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '../../components/calendar/event-calendar-updated.ts'

export const DialogDatePanel: FC = () => {
  // TODO: Deprecate Dialog for Calendar Date management
  const { isOpen, data } = useDialogForDatePanel()

  return (
    <>
      {isOpen && !!data && (
        <>
          {/*{data.mode == 'calendar-date-panel' && (
            <GenericDialog
              onClose={closeDialog}
              labelOnClose='Indietro'
              title='Attività'
            >
              <div className='p-4 flex flex-col gap-1'>
                <DatePanelInner
                  //
                  calendarId={data.calendarId}
                  date={data.date}
                />
              </div>
            </GenericDialog>
          )}*/}
          {/*
          {data.mode == 'calendar-panel' && (
            <GenericDialog
              onClose={closeDialog}
              labelOnClose='Indietro'
              title='Attività'
            >
              <div className='p-4 flex flex-col gap-1'>
                <CalendarLoaderComponent calendarId={data.calendarId} />
              </div>
            </GenericDialog>
          )}
          */}
        </>
      )}
    </>
  )
}

const periodRefreshDateInMillis = 3 * 60 * 60 * 1000 // 3 minutes.
const { readCalendar, readCalendarDate } = getSDK()
export const TabHistoryCalendarLoaderComponent: FC<{
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
  const calendar = data?.data

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Caricamento...</Badge>
        </>
      )}
      {!!calendar && (
        <>
          <TabHistoryCalendarComponent
            calendar={calendar}
            refreshCalendar={refreshCalendar}
          />
        </>
      )}
    </>
  )
}
const TabHistoryCalendarComponent: FC<{
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
        >
          {calendar.days.map((date, index) => (
            <StreamlineBoxDate
              //
              key={index}
              spacesOffset={2}
              date={date.date}
            >
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
            </StreamlineBoxDate>
          ))}
        </StreamlineBoxCalendar>
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

export const DatePanelInner: FC<{
  calendarId: number
  date: string
}> = ({ calendarId, date }) => {
  const [data, { refetch: refreshDate }] = useWrapperForCreateResource(() =>
    readCalendarDate(calendarId, date)
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshDate,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [calendarId, date])
  useEffect(() => {
    // TODO: Go in loading if calendar/date is changing
    refreshDate()
  }, [calendarId, date])
  useEffect(() => {
    const listener: CustomEventFnType<
      CustomEventTypeCalendarUpdated
    > = event => {
      if (event.detail.calendarId === calendarId) {
        refreshDate()
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Caricamento...</Badge>
        </>
      )}
      {!!data?.data && (
        <>
          <StreamlinePre>
            <StreamlineBoxDate
              //
              spacesOffset={0}
              date={data.data.date}
            >
              <StreamlineBoxCalendar
                spacesOffset={2}
                calendarColor={data.data.calendar.color}
                calendarName={data.data.calendar.name}
              >
                {data.data.todos.map((todo, index) => (
                  <StreamlineTodo
                    key={index}
                    calendar={data.data.calendar}
                    date={date}
                    mode={{
                      type: 'todo',
                      todo,
                    }}
                  />
                ))}
                {(data.data.doneTasks || []).map((doneTask, index) => (
                  <StreamlineTodo
                    key={index}
                    calendar={data.data.calendar}
                    date={date}
                    mode={{
                      type: 'done-task',
                      doneTask,
                    }}
                  />
                ))}
              </StreamlineBoxCalendar>
            </StreamlineBoxDate>
          </StreamlinePre>
        </>
      )}
    </>
  )
}
