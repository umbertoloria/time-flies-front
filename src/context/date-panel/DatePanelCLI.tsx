'use client'

import { FC, useEffect } from 'react'
import { Badge } from '@/components/calendar/Badge'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '@/components/calendar/event-calendar-updated'
import { AgendaSingleDate } from '@/components/streamline/Agendas'
import { CustomEventFnType } from '@/events/event-builder'
import { useWrapperForCreateResource } from '@/lib/remote-resources'
import { getCalendarDateSDK } from '@/remote/remote'

export const periodRefreshDateInMillis = 3 * 60 * 60 * 1000 // 3 minutes.

const calendarDateSdk = getCalendarDateSDK()
export const DatePanelInnerCLI: FC<{
  calendarId: number
  date: string
}> = ({ calendarId, date }) => {
  const [data, { refetch: refreshDate }] = useWrapperForCreateResource(() =>
    calendarDateSdk.readCalendarDate(calendarId, date)
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshDate,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [calendarId, date])
  useEffect(() => {
    // TODO: Go in loading if calendar/date is changing
    refreshDate()
  }, [calendarId, date])
  useEffect(() => {
    const listener: CustomEventFnType<
      CustomEventTypeCalendarUpdated
    > = event => {
      if (event.detail.calendarId === calendarId) {
        refreshDate()
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])
  const allowNewDoneTasks =
    !data?.loading && !!data?.data
      ? data.data.doneTasks.length === 0 && data.data.todos.length === 0
      : false
  const allowNewTodos =
    !data?.loading && !!data?.data
      ? data.data.doneTasks.length === 0 && data.data.todos.length === 0
      : false

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Loading...</Badge>
        </>
      )}
      {!data?.loading && !!data?.data && (
        <>
          <AgendaSingleDate
            data={data.data}
            allowNewDoneTasks={allowNewDoneTasks}
            allowNewTodos={allowNewTodos}
          />
        </>
      )}
    </>
  )
}
