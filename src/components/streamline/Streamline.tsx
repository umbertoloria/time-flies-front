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
import { useReadStreamline } from '@/remote/useCalendarQueries'

export const Streamline: FC<{
  seeAllCalendars: boolean
}> = ({ seeAllCalendars }) => {
  const { data, isPending, error, refetch } = useReadStreamline(seeAllCalendars)

  useEffect(() => {
    const listener: CustomEventFnType<undefined> = () => {
      refetch().then()
    }
    subscribeToStreamlineUpdates(listener)
    return () => {
      unsubscribeToStreamlineUpdates(listener)
    }
  }, [])

  return (
    <div className='streamline-box'>
      <CalendarTitle textColor='#fff' label='Streamline' />
      {isPending ? (
        <Badge>Caricamento...</Badge>
      ) : error ? (
        <Badge>Errore!</Badge>
      ) : (
        <AgendaForStreamline data={data} />
      )}
    </div>
  )
}
