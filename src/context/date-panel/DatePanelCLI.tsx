'use client'

import { FC, useEffect } from 'react'
import { Badge } from '@/components/calendar/Badge'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '@/components/calendar/event-calendar-updated'
import { AgendaSingleDate } from '@/components/agenda'
import { CustomEventFnType } from '@/events/event-builder'
import { useReadCalendarDate } from '@/remote/useCalendarQueries'

export const DatePanelInnerCLI: FC<{
  calendarId: number
  date: string
}> = ({ calendarId, date }) => {
  const { data, isPending, error, refetch } = useReadCalendarDate(
    calendarId,
    date
  )

  useEffect(() => {
    const listener: CustomEventFnType<
      CustomEventTypeCalendarUpdated
    > = event => {
      if (event.detail.calendarId === calendarId) {
        refetch().then()
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])

  return (
    <>
      {isPending ? (
        <Badge>Caricamento...</Badge>
      ) : error ? (
        <Badge>Errore!</Badge>
      ) : (
        <AgendaSingleDate data={data} />
      )}
    </>
  )
}
