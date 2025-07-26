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
    <div className='streamline'>
      <CalendarTitle textColor='#fff' label='Streamline' />
      {!dataStreamline?.data ? (
        <>Searching...</>
      ) : (
        <>
          <div className='m-auto text-gray-700 flex flex-col gap-2 overflow-y-scroll max-h-96 rounded-sm'>
            <StreamlineStateless response={dataStreamline.data} />
          </div>
        </>
      )}
    </div>
  )
}

const StreamlineStateless: FC<{
  response: TCalendarSDK.ReadPlannedEventsResponse
}> = ({ response }) => {
  return (
    <div>
      {response.dates.map((date, index) => (
        <div key={index}>
          <b>{displayDateFromLocalDate(date.date)}</b>
          {date.calendars.map((calendar, index) => (
            <div key={index}>
              {calendar.dates.map((date, index) => (
                <StreamlineItem key={index} calendar={calendar} date={date} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const StreamlineItem: FC<{
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
