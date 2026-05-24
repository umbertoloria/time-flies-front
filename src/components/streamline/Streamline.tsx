'use client'

import { FC, Fragment, useEffect } from 'react'
import { Badge } from '@/components/calendar/Badge'
import { CalendarTitle } from '@/components/calendar/CalendarGrid'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from '@/components/streamline/event-streamline-updated'
import {
  StreamlineBoxCalendar,
  StreamlineBoxDate,
  StreamlinePre,
  StreamlineTodo,
} from '@/components/streamline/StreamlineStateless'
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
        <>
          <StreamlinePre>
            {dataStreamline.data.dates.map(({ date, calendars }, index) => (
              <Fragment key={index}>
                <StreamlineBoxDate spacesOffset={0} date={date} />
                {calendars.map((calendar, index) => (
                  <Fragment key={index}>
                    <StreamlineBoxCalendar
                      key={index}
                      spacesOffset={2}
                      calendarColor={calendar.color}
                      calendarName={calendar.name}
                    />
                    {calendar.todos.map((todo, index) => (
                      <StreamlineTodo
                        key={index}
                        calendar={calendar}
                        date={date}
                        mode={{
                          type: 'todo',
                          todo,
                        }}
                        showButtonToOpenInDatePanel
                      />
                    ))}
                    {/*{(calendar.doneTasks || []).map((doneTask, index) => (
                      <StreamlineTodo
                        key={index}
                        calendar={calendar}
                        date={date}
                        mode={{
                          type: 'done-task',
                          doneTask,
                        }}
                        showButtonToOpenInDatePanel
                      />
                    ))}*/}
                    {'\n'}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </StreamlinePre>
        </>
      )}
    </div>
  )
}
