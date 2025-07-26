import { FC, useEffect } from 'react'
import { CalendarTitle } from '../calendar/CalendarGrid.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendarSDK } from '../../remote/sdk/types'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { useDialogForCheckPlannedEvent } from '../../context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from './event-streamline-updated.ts'

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
      <pre>
        {response.dates.map((date, index) => (
          <StreamlineDateBox key={index} date={date} />
        ))}
      </pre>
    </div>
  )
}

const StreamlineDateBox: FC<{
  date: TCalendarSDK.ReadPlannedEventsResponseDateBox
}> = ({ date }) => {
  return (
    <>
      <>
        <u>Date</u>: <b>{displayDateFromLocalDate(date.date)}</b>
      </>
      {'\n'}
      {date.calendars.map((calendar, index) => (
        <>
          <StreamlineCalendar key={index} calendar={calendar} />
          {'\n'}
        </>
      ))}
    </>
  )
}

const StreamlineCalendar: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
}> = ({ calendar }) => {
  return (
    <>
      {'  '}
      <u>Calendar</u>:{' '}
      <span style={{ color: calendar.color }}>{calendar.name}</span>
      {'\n'}
      {calendar.dates.map((date, index) => (
        <StreamlineDate key={index} calendar={calendar} date={date} />
      ))}
      {'\n'}
    </>
  )
}

const StreamlineDate: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
  date: TCalendarSDK.ReadPlannedEventsResponseDate
}> = ({ calendar, date }) => {
  const { openDialog } = useDialogForCheckPlannedEvent()

  return (
    <>
      {'  *:\n'}
      {'    '}
      <>Notes</>
      {': '}
      <>{typeof date.notes === 'string' ? <>{date.notes}</> : <i>null</i>}</>
      {'\n'}
      {'    '}
      <span
        className='pre-btn'
        onClick={() => {
          openDialog(calendar.id, date.id, 'done')
        }}
      >
        {'[Done?]'}
      </span>{' '}
      <span
        className='pre-btn'
        onClick={() => {
          openDialog(calendar.id, date.id, 'missed')
        }}
      >
        {'[Salta?]'}
      </span>
    </>
  )
}
