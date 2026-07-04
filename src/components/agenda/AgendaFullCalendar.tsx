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
            taskId={date.taskId || 0} // TODO: Never happens, but clean
            notes={date.notes}
            showDate
          />
        ))}
        {calendar.plannedDays?.map((todo, index) => (
          <ListItemTaskTodo
            key={index}
            calendar={calendar}
            todo={todo}
            date={todo.date}
          />
        ))}
        {calendar.unplannedTodos?.map((todo, index) => (
          <ListItemTaskTodo key={index} calendar={calendar} todo={todo} />
        ))}
      </div>
    </div>
  )
}
