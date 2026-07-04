'use client'

import { FC, useEffect } from 'react'
import { Badge } from '@/components/calendar/Badge'
import { CalendarTitle } from '@/components/calendar/CalendarGrid'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from '@/components/streamline/event-streamline-updated'
import { AgendaForStreamline } from '@/components/agenda'
import { CustomEventFnType } from '@/events/event-builder'
import { useWrapperForCreateResource } from '@/lib/remote-resources'
import { getSDK } from '@/remote/remote'

const { readStreamline } = getSDK()
export const Streamline: FC<{
  seeAllCalendars: boolean
}> = ({ seeAllCalendars }) => {
  // Showing only Today Planned Events
  const [dataStreamline, { refetch: refreshStreamline }] =
    useWrapperForCreateResource(
      () =>
        readStreamline({
          seeAllCalendars,
        }).then(data => (data === 'unable' ? undefined : data)),
      true
    )

  useEffect(() => {
    refreshStreamline()
  }, [seeAllCalendars])

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
        <AgendaForStreamline data={dataStreamline.data} />
      )}
    </div>
  )
}
