import { FC } from 'react'
import { NotebookPen, SquareCheck } from 'lucide-react'
import { displayDateFromLocalDate } from '@/components/calendar/utils'
import { useDialogForCheckPlannedEvent } from '@/context/dialog-check-planned-events/ContextDialogForCheckPlannedEvents'
import { TCalendarRcd } from '@/remote/sdk/types'

export const ListItemTaskDone: FC<{
  calendar: TCalendarRcd
  date: string
  notes?: string
  showDate?: boolean
}> = ({ calendar, date, notes, showDate }) => {
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
        {!!calendar.usesNotes && (
          <span
            className='pre-btn'
            onClick={() => {
              openDialogForCheckPlannedEvent(
                calendar,
                date,
                {
                  id: 0, // FIXME: Never used but dangerous!
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
