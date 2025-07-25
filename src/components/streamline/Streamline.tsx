import { FC, useEffect, useMemo } from 'react'
import { CalendarTitle } from '../calendar/CalendarGrid.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TEvent } from '../../remote/sdk/types'
import { ColouredLabel } from '../coloured/ColouredLabel.tsx'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { useDialogForCheckPlannedEvent } from '../../context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from './event-streamline-updated.ts'
import { ColouredQuad } from '../coloured/ColouredQuad.tsx'
import {
  getDateWithOffsetDays,
  getLocalDayByDate,
  getTodayDate,
} from '../../lib/utils.ts'

const { readStreamline } = getSDK()
export const Streamline: FC = () => {
  // Showing only Today Planned Events
  const [dataStreamline, { refetch: refreshStreamline }] =
    useWrapperForCreateResource(() =>
      readStreamline({ onlyToday: false }).then(data =>
        data === 'unable' ? undefined : data
      )
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

  // TODO: Perform past Event filtering server-side
  const actualEvents = useMemo(() => {
    if (!dataStreamline?.data) {
      return null
    }

    // Showing Planned Events until the day after tomorrow (included).
    const limitLocalDate = getLocalDayByDate(
      getDateWithOffsetDays(getTodayDate(), 2)
    )
    return dataStreamline.data.events.filter(
      event => event.date.localeCompare(limitLocalDate) <= 0
    )
  }, [dataStreamline])

  return (
    <div className='streamline'>
      <CalendarTitle textColor='#fff' label='Streamline' />
      {!actualEvents ? (
        <>Searching...</>
      ) : (
        <>
          <div className='m-auto text-gray-700 flex flex-col gap-2 overflow-y-scroll max-h-96 rounded-sm'>
            {actualEvents.map((event, index) => (
              <StreamlineItem key={index} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const StreamlineItem: FC<{
  event: TEvent
}> = props => {
  const { openDialog } = useDialogForCheckPlannedEvent()

  return (
    <div className='min-h-11 p-2 rounded-sm bg-gray-200 flex flex-wrap gap-2 justify-between'>
      <div className='flex gap-2'>
        <ColouredQuad color={props.event.calendar.color} />

        <div>
          <ColouredLabel bold>{props.event.calendar.name}</ColouredLabel>
        </div>

        <div>
          <ColouredLabel>
            {displayDateFromLocalDate(props.event.date)}
          </ColouredLabel>
        </div>
      </div>

      <div>
        <button
          className='btn-primary'
          onClick={() => {
            openDialog(props.event.calendar.id, props.event.id, 'done')
          }}
        >
          {'Done?'}
        </button>
        <button
          className='btn-warning ml-1'
          onClick={() => {
            openDialog(props.event.calendar.id, props.event.id, 'missed')
          }}
        >
          {'Salta?'}
        </button>
      </div>
    </div>
  )
}
