import { FC, useEffect } from 'react'
import { CalendarTitle } from '../calendar/CalendarGrid.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import {
  TCalendarRcd,
  TCalendarSDK,
  TNewDoneTask,
  TNewTodo,
} from '../../remote/sdk/types'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { useDialogForCheckPlannedEvent } from '../../context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  subscribeToStreamlineUpdates,
  unsubscribeToStreamlineUpdates,
} from './event-streamline-updated.ts'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'

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
          <StreamlineStatelessDateToCalendar
            dates={dataStreamline.data.dates}
          />
        </>
      )}
    </div>
  )
}

export const StreamlineStatelessDateToCalendar: FC<{
  dates: {
    date: string
    calendars: TCalendarSDK.ReadPlannedEventsResponseCalendar[]
  }[]
}> = ({ dates }) => {
  return (
    <div className='streamline'>
      <pre className='streamline-pre'>
        {dates.map(({ date, calendars }) => (
          <>
            {'Data: '}
            {displayDateFromLocalDate(date)}
            {'\n'}
            {calendars.map(calendar => (
              <>
                {'  Calendario: '}
                <span style={{ color: calendar.color }}>{calendar.name}</span>
                {'\n'}
                {calendar.todos.map((todo, index) => (
                  <>
                    <StreamlineTodo
                      key={index}
                      calendar={calendar}
                      date={date}
                      mode={{
                        type: 'todo',
                        todo,
                      }}
                    />
                    {'\n'}
                  </>
                ))}
                {(calendar.doneTasks || []).map((doneTask, index) => (
                  <>
                    <StreamlineTodo
                      key={index}
                      calendar={calendar}
                      date={date}
                      mode={{
                        type: 'done-task',
                        doneTask,
                      }}
                    />
                    {'\n'}
                  </>
                ))}
                {'\n'}
              </>
            ))}
          </>
        ))}
      </pre>
    </div>
  )
}
export const StreamlineStatelessCalendarToDate: FC<{
  calendars: {
    calendar: TCalendarRcd
    dates: {
      date: string
      todos: TNewTodo[]
      doneTasks: TNewDoneTask[]
    }[]
  }[]
}> = ({ calendars }) => {
  return (
    <div className='streamline'>
      <pre className='streamline-pre'>
        {calendars.map(({ calendar, dates }) => (
          <>
            {'Calendario: '}
            <span style={{ color: calendar.color }}>{calendar.name}</span>
            {'\n'}
            {dates.map(date => (
              <>
                {'  Data: '}
                {displayDateFromLocalDate(date.date)}
                {'\n'}
                {date.todos.map((todo, index) => (
                  <>
                    <StreamlineTodo
                      key={index}
                      calendar={calendar}
                      date={date.date}
                      mode={{
                        type: 'todo',
                        todo,
                      }}
                    />
                    {'\n'}
                  </>
                ))}
                {date.doneTasks.map((doneTask, index) => (
                  <>
                    <StreamlineTodo
                      key={index}
                      calendar={calendar}
                      date={date.date}
                      mode={{
                        type: 'done-task',
                        doneTask,
                      }}
                    />
                    {'\n'}
                  </>
                ))}
                {'\n'}
              </>
            ))}
          </>
        ))}
      </pre>
    </div>
  )
}

const StreamlineTodo: FC<{
  calendar: TCalendarRcd
  date: string
  mode:
    | {
        type: 'todo'
        todo: TNewTodo
      }
    | {
        type: 'done-task'
        doneTask: TNewDoneTask
      }
}> = ({ calendar, date, mode }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <>
      {mode.type === 'todo' && <>{'  [ ] '}</>}
      {mode.type === 'done-task' && <>{'  [v] '}</>}
      {!!calendar.usesNotes && (
        <>
          {mode.type === 'todo' && (
            <>
              {'notes: '}
              <>
                {typeof mode.todo.notes === 'string' ? (
                  <>{mode.todo.notes}</>
                ) : (
                  <span style={{ opacity: 0.6 }}>null</span>
                )}
              </>
              {'\n'}
              {'      '}
            </>
          )}
          {mode.type === 'done-task' && (
            <>
              {'notes: '}
              <>
                {typeof mode.doneTask.notes === 'string' ? (
                  <>{mode.doneTask.notes}</>
                ) : (
                  <span style={{ opacity: 0.6 }}>null</span>
                )}
              </>
              {'\n'}
              {'      '}
            </>
          )}
        </>
      )}
      {mode.type === 'todo' && (
        <>
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(calendar, date, mode.todo, 'done')
            }}
          >
            {'[Done?]'}
          </span>{' '}
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(
                calendar,
                date,
                mode.todo,
                'missed'
              )
            }}
          >
            {'[Salta?]'}
          </span>{' '}
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(calendar, date, mode.todo, 'move')
            }}
          >
            {'[Sposta]'}
          </span>{' '}
          {!!calendar.usesNotes && (
            <>
              <span
                className='pre-btn'
                onClick={() => {
                  openDialogForCheckPlannedEvent(
                    calendar,
                    date,
                    mode.todo,
                    'update-notes'
                  )
                }}
              >
                {'[Note]'}
              </span>{' '}
            </>
          )}
        </>
      )}
      {mode.type === 'done-task' && (
        <>
          {!!calendar.usesNotes && (
            <>
              <span
                className='pre-btn'
                onClick={() => {
                  openDialogForCheckPlannedEvent(
                    calendar,
                    date,
                    {
                      id: 0, // FIXME: Never used but dangerous!
                      notes: mode.doneTask.notes,
                    },
                    'update-done-task-notes'
                  )
                }}
              >
                {'[Note]'}
              </span>{' '}
            </>
          )}
        </>
      )}
      <span
        className='pre-btn'
        onClick={() => {
          openDialogForDatePanel({
            mode: 'calendar-date-panel',
            calendarId: calendar.id,
            date,
          })
        }}
      >
        {'[Apri]'}
      </span>
    </>
  )
}
