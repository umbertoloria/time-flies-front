import { FC, useEffect } from 'react'
import { CalendarTitle } from '../calendar/Calendar.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendarSDK, TEvent } from '../../remote/sdk/types'
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
  const safeStreamline = (data: TCalendarSDK.ReadPlannedEvents | 'unable') =>
    data === 'unable' ? undefined : data
  const [dataStreamline, { refetch: refreshStreamline }] =
    useWrapperForCreateResource(() => readStreamline().then(safeStreamline))

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
    <div>
      <CalendarTitle textColor='#fff' label='Streamline' />
      {!dataStreamline?.data || dataStreamline.loading ? (
        <>Searching...</>
      ) : (
        <>
          <div className='m-auto text-gray-700 flex flex-col gap-2'>
            {(dataStreamline.data?.events || []).map((event, index) => (
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
    <div className='min-h-9 p-2 rounded-sm bg-gray-200 flex flex-wrap gap-2'>
      <ColouredQuad color={props.event.calendar.color} />

      <div>
        <ColouredLabel bold>{props.event.calendar.name}</ColouredLabel>
      </div>

      <div>
        <ColouredLabel>
          {displayDateFromLocalDate(props.event.date)}
        </ColouredLabel>
      </div>
      <div>
        <button
          className='btn-primary'
          onClick={() => {
            openDialog(props.event.calendar.id, props.event.id)
          }}
        >
          {'Done?'}
        </button>
      </div>
    </div>
  )
}
