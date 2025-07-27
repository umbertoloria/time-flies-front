import { FC, useEffect } from 'react'
import { CalendarTitle } from '../calendar/CalendarGrid.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendarSDK, TNewTodo } from '../../remote/sdk/types'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { useDialogForCheckPlannedEvent } from '../../context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from './event-streamline-updated.ts'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'

const { readStreamline } = getSDK()
export const Streamline: FC = () => {
  // Showing only Today Planned Events
  const [dataStreamline, { refetch: refreshStreamline }] =
    useWrapperForCreateResource(() =>
      readStreamline().then(data => (data === 'unable' ? undefined : data))
    )

  useEffect(() => {
    const listener: CustomEventFnType<undefined> = () => {
      refreshStreamline()
    }
    subscribeToStreamlineUpdates(listener)
    return () => {
      unsubscribeToStreamlineUpdates(listener)
    }
  }, [])

  return (
    <div className='streamline-box'>
      <CalendarTitle textColor='#fff' label='Streamline' />
      {!dataStreamline?.data ? (
        <>Searching...</>
      ) : (
        <>
          <StreamlineStateless response={dataStreamline.data} />
        </>
      )}
    </div>
  )
}

const StreamlineStateless: FC<{
  response: TCalendarSDK.ReadPlannedEventsResponse
}> = ({ response }) => {
  return (
    <div className='streamline'>
      <pre className='streamline-pre'>
        {response.dates.map((plannedEventDateInfo, index) => (
          <StreamlineDateBox
            key={index} // Doesn't work: this uses a Fragment as Root Tag.
            plannedEventDateInfo={plannedEventDateInfo}
          />
        ))}
      </pre>
    </div>
  )
}

const StreamlineDateBox: FC<{
  plannedEventDateInfo: TCalendarSDK.ReadPlannedEventsResponseDateBox
}> = ({ plannedEventDateInfo }) => {
  return (
    <>
      {'Data: '}
      {displayDateFromLocalDate(plannedEventDateInfo.date)}
      {'\n'}
      {plannedEventDateInfo.calendars.map((calendar, index) => (
        <>
          <StreamlineCalendar
            key={index}
            calendar={calendar}
            date={plannedEventDateInfo.date}
          />
          {'\n'}
        </>
      ))}
    </>
  )
}

const StreamlineCalendar: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
  date: string
}> = ({ calendar, date }) => {
  return (
    <>
      {'  '}
      {'Calendario: '}
      <span style={{ color: calendar.color }}>{calendar.name}</span>
      {'\n'}
      {calendar.todos.map((todo, index) => (
        <StreamlineTodo
          key={index}
          calendar={calendar}
          date={date}
          todo={todo}
        />
      ))}
      {'\n'}
    </>
  )
}

const StreamlineTodo: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
  date: string
  todo: TNewTodo
}> = ({ calendar, date, todo }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <>
      {'  *: '}
      {'notes: '}
      <>
        {typeof todo.notes === 'string' ? (
          <>{todo.notes}</>
        ) : (
          <span style={{ opacity: 0.6 }}>null</span>
        )}
      </>
      {'\n'}
      {'    '}
      <span
        className='pre-btn'
        onClick={() => {
          openDialogForCheckPlannedEvent(calendar.id, date, todo.id, 'done')
        }}
      >
        {'[Done?]'}
      </span>{' '}
      <span
        className='pre-btn'
        onClick={() => {
          openDialogForCheckPlannedEvent(calendar.id, date, todo.id, 'missed')
        }}
      >
        {'[Salta?]'}
      </span>{' '}
      <span
        className='pre-btn'
        onClick={() => {
          openDialogForCheckPlannedEvent(calendar.id, date, todo.id, 'move')
        }}
      >
        {'[Sposta]'}
      </span>{' '}
      <span
        className='pre-btn'
        onClick={() => {
          openDialogForDatePanel({
            mode: 'calendar-date-panel',
            calendarId: calendar.id,
            date,
          })
        }}
      >
        {'[Apri]'}
      </span>
    </>
  )
}
