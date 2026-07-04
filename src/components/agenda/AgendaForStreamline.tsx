import { FC } from 'react'
import { TCalendarSDK } from '@/remote/sdk/types'
import { prettyDate } from '@/components/calendar/utils'
import { ListItemTaskTodo } from './ListItemTaskTodo'
import { ListItemTaskDone } from './ListItemTaskDone'

export const AgendaForStreamline: FC<{
  data: TCalendarSDK.ReadPlannedEventsResponse
}> = ({ data }) => {
  const { dates, unplannedTodosCalendars } = data
  return (
    <div className='agenda'>
      {dates.map(({ date, calendars }, index) => (
        <div key={index}>
          <h2>{prettyDate(date)}</h2>
          {calendars.map((calendar, index) => (
            <div key={index} className='mt-3'>
              <h3
                style={{
                  color: calendar.color,
                }}
              >
                {calendar.name}
              </h3>
              {calendar.doneTasks?.map((task, index) => (
                <ListItemTaskDone
                  key={index}
                  calendar={calendar}
                  date={date}
                  taskId={task.id}
                  notes={task.notes}
                  showDate={true}
                />
              ))}
              {calendar.todos?.map((todo, index) => (
                <ListItemTaskTodo
                  key={index}
                  calendar={calendar}
                  todo={todo}
                  date={date}
                  showButtonToOpenInDatePanel
                />
              ))}
            </div>
          ))}
        </div>
      ))}
      {!!unplannedTodosCalendars?.length && (
        <div>
          <h2>Todos senza data</h2>
          {unplannedTodosCalendars.map((calendar, index) => (
            <div key={index} className='mt-3'>
              <h3
                style={{
                  color: calendar.color,
                }}
              >
                {calendar.name}
              </h3>
              {calendar.todos?.map((todo, index) => (
                <ListItemTaskTodo
                  key={index}
                  calendar={calendar}
                  todo={todo}
                  showButtonToOpenInDatePanel
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
