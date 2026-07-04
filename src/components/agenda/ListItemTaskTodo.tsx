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
import { displayDateFromLocalDate } from '@/components/calendar/utils'

export const ListItemTaskTodo: FC<{
  calendar: TCalendarRcd
  todo: TNewTodo
  date: string
  showButtonToOpenInDatePanel?: boolean
}> = ({ calendar, todo, date, showButtonToOpenInDatePanel }) => {
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
            openDialogForCheckPlannedEvent(calendar, todo, 'done', date)
          }}
        >
          <Square className='idle' />
          <SquareCheck className='hover' />
        </span>
        <span
          className='pre-btn'
          onClick={() => {
            openDialogForCheckPlannedEvent(calendar, todo, 'move', date)
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
                todo,
                'update-notes',
                date
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
      {date && (
        <span>
          <i>{displayDateFromLocalDate(date)}</i>
        </span>
      )}
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
