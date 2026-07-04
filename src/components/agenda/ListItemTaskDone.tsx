import { FC } from 'react'
import { CalendarDays, NotebookPen, SquareCheck } from 'lucide-react'
import { displayDateFromLocalDate } from '@/components/calendar/utils'
import { useDialogForCheckPlannedEvent } from '@/context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents'
import { TCalendarRcd } from '@/remote/sdk/types'

export const ListItemTaskDone: FC<{
  calendar: TCalendarRcd
  date: string
  taskId: number
  notes?: string
  hideDate?: boolean
}> = ({ calendar, date, taskId, notes, hideDate }) => {
  const { openDialog: openDialogForCheckPlannedEvent } =
    useDialogForCheckPlannedEvent()

  return (
    <div className='list-item-task'>
      <div className='icons'>
        <span
          className='check'
          style={{
            color: calendar.color,
          }}
        >
          <SquareCheck />
        </span>
        <span
          className='pre-btn'
          onClick={() => {
            openDialogForCheckPlannedEvent(
              calendar,
              {
                id: taskId,
                notes,
              },
              'move-done-task',
              date
            )
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
                {
                  id: taskId,
                  notes,
                },
                'update-done-task-notes',
                date
              )
            }}
          >
            <NotebookPen />
          </span>
        )}
      </div>
      {!hideDate && (
        <span>
          <i>{displayDateFromLocalDate(date)}</i>
        </span>
      )}
      {!!calendar.usesNotes && !!notes && (
        <span className='todo-notes'>{notes}</span>
      )}
    </div>
  )
}
