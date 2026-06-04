import { FC } from 'react'
import { TCalendar } from '@/remote/sdk/types'
import { ListItemTaskDone } from './ListItemTaskDone'
import { ListItemTaskTodo } from './ListItemTaskTodo'

export const AgendaFullCalendar: FC<{
  calendar: TCalendar
}> = ({ calendar }) => {
  return (
    <div className='agenda'>
      <div>
        <h3
          style={{
            color: calendar.color,
          }}
        >
          {calendar.name}
        </h3>
        {calendar.days.map((date, index) => (
          <ListItemTaskDone
            key={index}
            calendar={calendar}
            date={date.date}
            notes={date.notes}
            showDate
          />
        ))}
        {calendar.plannedDays?.map((date, index) => (
          <ListItemTaskTodo
            key={index}
            calendar={calendar}
            date={date.date}
            todo={{
              id: 0, // FIXME: Missing ID
              notes: date.notes,
            }}
          />
        ))}
      </div>
    </div>
  )
}
