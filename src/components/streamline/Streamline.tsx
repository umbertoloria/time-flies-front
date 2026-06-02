'use client'

import { FC, useEffect } from 'react'
import { Badge } from '@/components/calendar/Badge'
import { CalendarTitle } from '@/components/calendar/CalendarGrid'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from '@/components/streamline/event-streamline-updated'
import { AgendaForStreamline } from '@/components/streamline/Agendas'
import { CustomEventFnType } from '@/events/event-builder'
import { useWrapperForCreateResource } from '@/lib/remote-resources'
import { getSDK } from '@/remote/remote'

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
        <Badge>Caricamento...</Badge>
      ) : (
        <AgendaForStreamline dates={dataStreamline.data.dates} />
      )}
    </div>
  )
}
