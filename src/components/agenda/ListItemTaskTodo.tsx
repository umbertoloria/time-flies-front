import { FC } from 'react'
import {
  CalendarDays,
  Info,
  NotebookPen,
  Square,
  SquareCheck,
} from 'lucide-react'
import { TCalendarRcd, TNewTodo } from '@/remote/sdk/types'
import { useDialogForCheckPlannedEvent } from '@/context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents'
import { useDialogForDatePanel } from '@/context/date-panel/ContextDialogForDatePanel'

export const ListItemTaskTodo: FC<{
  calendar: TCalendarRcd
  date: string
  todo: TNewTodo
  showButtonToOpenInDatePanel?: boolean
}> = ({ calendar, date, todo, showButtonToOpenInDatePanel }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()

  return (
    <div className='list-item-task'>
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
        {showButtonToOpenInDatePanel && (
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
        )}
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
