import { FC, useEffect } from 'react'
import { CalendarTitle } from '../calendar/CalendarGrid.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from './event-streamline-updated.ts'
import {
  StreamlineBoxCalendar,
  StreamlineBoxDate,
  StreamlinePre,
  StreamlineTodo,
} from './StreamlineStateless.tsx'

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
          <StreamlinePre>
            {dataStreamline.data.dates.map(({ date, calendars }, index) => (
              <StreamlineBoxDate
                //
                key={index}
                spacesOffset={0}
                date={date}
              >
                {calendars.map((calendar, index) => (
                  <StreamlineBoxCalendar
                    key={index}
                    spacesOffset={2}
                    calendarColor={calendar.color}
                    calendarName={calendar.name}
                  >
                    {calendar.todos.map((todo, index) => (
                      <StreamlineTodo
                        key={index}
                        calendar={calendar}
                        date={date}
                        mode={{
                          type: 'todo',
                          todo,
                        }}
                      />
                    ))}
                    {(calendar.doneTasks || []).map((doneTask, index) => (
                      <StreamlineTodo
                        key={index}
                        calendar={calendar}
                        date={date}
                        mode={{
                          type: 'done-task',
                          doneTask,
                        }}
                      />
                    ))}
                  </StreamlineBoxCalendar>
                ))}
              </StreamlineBoxDate>
            ))}
          </StreamlinePre>
        </>
      )}
    </div>
  )
}
