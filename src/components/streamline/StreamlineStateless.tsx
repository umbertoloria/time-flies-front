import { FC, PropsWithChildren } from 'react'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { TCalendarRcd, TNewTodo } from '../../remote/sdk/types'
import { useDialogForCheckPlannedEvent } from '../../context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents.tsx'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'

export const StreamlinePre: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='streamline'>
      <pre className='streamline-pre'>{children}</pre>
    </div>
  )
}
export const StreamlineBoxDate: FC<
  PropsWithChildren<{
    spacesOffset: number
    date: string
  }>
> = ({ spacesOffset, date, children }) => {
  return (
    <>
      {spacesOffset > 0 && ' '.repeat(spacesOffset)}
      {'Data: '}
      {displayDateFromLocalDate(date)}
      {'\n'}
      {children}
      {'\n'}
    </>
  )
}
export const StreamlineBoxCalendar: FC<
  PropsWithChildren<{
    spacesOffset: number
    calendarColor: string
    calendarName: string
  }>
> = ({ spacesOffset, calendarColor, calendarName, children }) => {
  return (
    <>
      {spacesOffset > 0 && ' '.repeat(spacesOffset)}
      {'Calendario: '}
      <span style={{ color: calendarColor }}>{calendarName}</span>
      {'\n'}
      {children}
      {'\n'}
    </>
  )
}

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
      {'\n'}
    </>
  )
}
