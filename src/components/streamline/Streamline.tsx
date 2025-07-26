import { FC, useEffect } from 'react'
import { CalendarTitle } from '../calendar/CalendarGrid.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendarSDK } from '../../remote/sdk/types'
import { ColouredLabel } from '../coloured/ColouredLabel.tsx'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { useDialogForCheckPlannedEvent } from '../../context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from './event-streamline-updated.ts'
import { ColouredQuad } from '../coloured/ColouredQuad.tsx'

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
      {response.dates.map((date, index) => (
        <div key={index}>
          <b>{displayDateFromLocalDate(date.date)}</b>
          {date.calendars.map((calendar, index) => (
            <StreamlineCalendar key={index} calendar={calendar} />
          ))}
        </div>
      ))}
    </div>
  )
}

const StreamlineCalendar: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
}> = ({ calendar }) => {
  return (
    <div>
      {calendar.dates.map((date, index) => (
        <StreamlineDate key={index} calendar={calendar} date={date} />
      ))}
    </div>
  )
}

const StreamlineDate: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
  date: TCalendarSDK.ReadPlannedEventsResponseDate
}> = ({ calendar, date }) => {
  const { openDialog } = useDialogForCheckPlannedEvent()

  return (
    <div className='min-h-11 p-2 rounded-sm bg-gray-200 flex flex-wrap gap-2 justify-between'>
      <div className='flex gap-2'>
        <ColouredQuad color={calendar.color} />

        <div>
          <ColouredLabel bold>{calendar.name}</ColouredLabel>
        </div>

        <div>
          <ColouredLabel>{displayDateFromLocalDate(date.date)}</ColouredLabel>
        </div>
      </div>

      <div>
        <button
          className='btn-primary'
          onClick={() => {
            openDialog(calendar.id, date.id, 'done')
          }}
        >
          {'Done?'}
        </button>
        <button
          className='btn-warning ml-1'
          onClick={() => {
            openDialog(calendar.id, date.id, 'missed')
          }}
        >
          {'Salta?'}
        </button>
      </div>
    </div>
  )
}
