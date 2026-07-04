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
  showDate?: boolean
}> = ({ calendar, date, taskId, notes, showDate }) => {
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
              date,
              {
                id: taskId,
                notes,
              },
              'move-done-task'
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
                date,
                {
                  id: taskId,
                  notes,
                },
                'update-done-task-notes'
              )
            }}
          >
            <NotebookPen />
          </span>
        )}
      </div>
      {showDate && (
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
