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
}> = ({ calendar, date, mode }) => {
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
        {'[Open]'}
      </span>
      {'\n'}
    </>
  )
}
