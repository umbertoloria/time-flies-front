import { FC, useEffect } from 'react'
import { Badge } from '../../components/calendar/Badge.tsx'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import {
  placeOffsetSpace,
  StreamlineBoxCalendar,
  StreamlineBoxDate,
  StreamlinePre,
  StreamlineTodo,
} from '../../components/streamline/StreamlineStateless.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from '../../components/calendar/event-calendar-updated.ts'
import { useDialogForInsertNewGoal } from '../dialog-insert-new-goal/ContextDialogForInsertNewGoal.tsx'
import { useDialogForInsertNewPlannedEvent } from '../dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent.tsx'
import { getSDK } from '../../remote/remote.ts'

export const periodRefreshDateInMillis = 3 * 60 * 60 * 1000 // 3 minutes.
const { calendarDateSdk } = getSDK()
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

  const { openDialog: openDialogForInsertNewGoal } = useDialogForInsertNewGoal()
  const { openDialog: openDialogForInsertNewPlannedEvent } =
    useDialogForInsertNewPlannedEvent()

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Loading...</Badge>
        </>
      )}
      {!data?.loading && !!data?.data && (
        <>
          <StreamlinePre>
            <StreamlineBoxDate
              //
              spacesOffset={0}
              date={data.data.date}
            />
            <StreamlineBoxCalendar
              spacesOffset={2}
              calendarColor={data.data.calendar.color}
              calendarName={data.data.calendar.name}
            />
            {/* Show all Todos */}
            {data.data.todos.map((todo, index) => (
              <StreamlineTodo
                key={index}
                calendar={data.data.calendar}
                date={date}
                mode={{
                  type: 'todo',
                  todo,
                }}
              />
            ))}
            {/* Show all Done Tasks */}
            {(data.data.doneTasks || []).map((doneTask, index) => (
              <StreamlineTodo
                key={index}
                calendar={data.data.calendar}
                date={date}
                mode={{
                  type: 'done-task',
                  doneTask,
                }}
              />
            ))}
            {(allowNewDoneTasks || allowNewTodos) && (
              <>
                {placeOffsetSpace(2)}
                {allowNewDoneTasks && (
                  <>
                    <span
                      className='pre-btn'
                      onClick={() => {
                        openDialogForInsertNewGoal(
                          data.data.calendar.id,
                          data.data.calendar.usesNotes || false,
                          date
                        )
                      }}
                    >
                      {'[Add done task]'}
                    </span>{' '}
                  </>
                )}
                {allowNewTodos && (
                  <>
                    <span
                      className='pre-btn'
                      onClick={() => {
                        openDialogForInsertNewPlannedEvent(
                          data.data.calendar.id,
                          data.data.calendar.usesNotes || false,
                          date
                        )
                      }}
                    >
                      {'[Add todo]'}
                    </span>{' '}
                  </>
                )}
              </>
            )}
          </StreamlinePre>
        </>
      )}
    </>
  )
}
