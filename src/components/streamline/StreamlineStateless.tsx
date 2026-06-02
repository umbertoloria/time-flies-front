import { FC, PropsWithChildren } from 'react'
import {
  CalendarDays,
  Info,
  NotebookPen,
  Square,
  SquareCheck,
} from 'lucide-react'
import { displayDateFromLocalDate } from '@/components/calendar/utils'
import { useDialogForDatePanel } from '@/context/date-panel/ContextDialogForDatePanel'
import { useDialogForCheckPlannedEvent } from '@/context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents'
import {
  TCalendar,
  TCalendarRcd,
  TCalendarSDK,
  TDay,
  TNewTodo,
} from '@/remote/sdk/types'

export const StreamlineNew: FC<{
  dates: TCalendarSDK.ReadPlannedEventsResponseDateBox[]
}> = ({ dates }) => {
  return (
    <div className='streamline-new'>
      {dates.map(({ date, calendars }, index) => (
        <StreamlineNewDate key={index} date={date} calendars={calendars} />
      ))}
    </div>
  )
}

const StreamlineNewDate: FC<{
  date: string
  calendars: TCalendarSDK.ReadPlannedEventsResponseCalendar[]
}> = ({ date, calendars }) => {
  return (
    <div className='streamline-new-date'>
      <h2>{displayDateFromLocalDate(date)}</h2>
      {calendars.map((calendar, index) => (
        <StreamlineNewCalendar key={index} calendar={calendar} date={date} />
      ))}
    </div>
  )
}

const StreamlineNewCalendar: FC<{
  calendar: TCalendarSDK.ReadPlannedEventsResponseCalendar
  date: string
}> = ({ calendar, date }) => {
  return (
    <div className='streamline-new-date-calendar'>
      <h3
        style={{
          color: calendar.color,
        }}
      >
        {calendar.name}
      </h3>
      {calendar.todos.map((todo, index) => (
        <StreamlineNewTodo
          key={index}
          calendar={calendar}
          date={date}
          todo={todo}
        />
      ))}
    </div>
  )
}

export const StreamlineNewCalendar2: FC<{
  calendar: TCalendar
}> = ({ calendar }) => {
  return (
    <div className='streamline-new-date-calendar'>
      <h3
        style={{
          color: calendar.color,
        }}
      >
        {calendar.name}
      </h3>
      {calendar.days.map((date, index) => (
        <StreamlineDoneTask key={index} calendar={calendar} date={date} />
      ))}
    </div>
  )
}

const StreamlineNewTodo: FC<{
  calendar: TCalendarRcd
  date: string
  todo: TNewTodo
}> = ({ calendar, date, todo }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <div className='streamline-new-date-calendar-todo'>
      <div className='icons'>
        <span
          className='pre-btn check'
          style={{
            color: calendar.color,
          }}
          onClick={() => {
            openDialogForCheckPlannedEvent(calendar, date, todo, 'done')
          }}
        >
          <Square className='idle' />
          <SquareCheck className='hover' />
        </span>
        <span
          className='pre-btn'
          onClick={() => {
            openDialogForCheckPlannedEvent(calendar, date, todo, 'move')
          }}
        >
          <CalendarDays />
        </span>
        {!!calendar.usesNotes && (
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(
                calendar,
                date,
                todo,
                'update-notes'
              )
            }}
          >
            <NotebookPen />
          </span>
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
          <Info />
        </span>
      </div>
      {!!calendar.usesNotes && !!todo.notes ? (
        <span className='todo-notes'>{todo.notes}</span>
      ) : (
        <span className='todo-notes'>
          <i>Niente note</i>
        </span>
      )}
    </div>
  )
}

const StreamlineDoneTask: FC<{
  calendar: TCalendarRcd
  date: TDay
}> = ({ calendar, date }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <div className='streamline-new-date-calendar-todo'>
      <div className='icons'>
        <span
          className='check'
          style={{
            color: calendar.color,
          }}
        >
          <SquareCheck />
        </span>
        {!!calendar.usesNotes && (
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(
                calendar,
                date.date,
                {
                  id: 0, // FIXME: Never used but dangerous!
                  notes: date.notes,
                },
                'update-done-task-notes'
              )
            }}
          >
            <NotebookPen />
          </span>
        )}
        <span
          className='pre-btn'
          onClick={() => {
            openDialogForDatePanel({
              mode: 'calendar-date-panel',
              calendarId: calendar.id,
              date: date.date,
            })
          }}
        >
          <Info />
        </span>
      </div>
      <span>
        <i>{displayDateFromLocalDate(date.date)}</i>
      </span>
      {!!calendar.usesNotes && !!date.notes && (
        <span className='todo-notes'>{date.notes}</span>
      )}
    </div>
  )
}

export const StreamlinePre: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='streamline'>
      <pre className='streamline-pre'>{children}</pre>
    </div>
  )
}
export const StreamlineBoxDate: FC<{
  spacesOffset: number
  date: string
}> = ({ spacesOffset, date }) => {
  return (
    <>
      {placeOffsetSpace(spacesOffset)}
      {'Data: '}
      {displayDateFromLocalDate(date)}
      {'\n'}
    </>
  )
}
export const StreamlineBoxCalendar: FC<{
  spacesOffset: number
  calendarColor: string
  calendarName: string
}> = ({ spacesOffset, calendarColor, calendarName }) => {
  return (
    <>
      {placeOffsetSpace(spacesOffset)}
      {'Calendario: '}
      <span style={{ color: calendarColor }}>{calendarName}</span>
      {'\n'}
    </>
  )
}

export const placeOffsetSpace = (spacesOffset: number) =>
  spacesOffset > 0 && ' '.repeat(spacesOffset)

export const StreamlineTodo: FC<{
  calendar: TCalendarRcd
  date: string
  mode:
    | {
        type: 'todo'
        todo: TNewTodo
      }
    | {
        type: 'done-task'
        doneTask: {
          notes?: string
        }
      }
  showButtonToOpenInDatePanel: boolean
}> = ({ calendar, date, mode, showButtonToOpenInDatePanel }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <>
      {placeOffsetSpace(2)}
      {mode.type === 'todo' && <>{'[ ] '}</>}
      {mode.type === 'done-task' && <>{'[v] '}</>}
      {!!calendar.usesNotes && (
        <>
          {mode.type === 'todo' && (
            <>
              {!!mode.todo.notes && (
                <>
                  {mode.todo.notes}
                  {'\n'}
                  {placeOffsetSpace(2 + 4)}
                </>
              )}
            </>
          )}
          {mode.type === 'done-task' && (
            <>
              {!!mode.doneTask.notes && (
                <>
                  {mode.doneTask.notes}
                  {'\n'}
                  {placeOffsetSpace(2 + 4)}
                </>
              )}
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
            {'[Done]'}
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
            {'[Skip]'}
          </span>{' '}
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(calendar, date, mode.todo, 'move')
            }}
          >
            {'[Move]'}
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
                {'[Notes]'}
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
                {'[Notes]'}
              </span>{' '}
            </>
          )}
        </>
      )}
      {showButtonToOpenInDatePanel && (
        <>
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
            {'[Show date]'}
          </span>
        </>
      )}
      {'\n'}
    </>
  )
}
