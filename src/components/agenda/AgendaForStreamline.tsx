import { FC } from 'react'
import { TCalendarSDK } from '@/remote/sdk/types'
import { prettyDate } from '@/components/calendar/utils'
import { ListItemTaskTodo } from './ListItemTaskTodo'

export const AgendaForStreamline: FC<{
  dates: TCalendarSDK.ReadPlannedEventsResponseDateBox[]
}> = ({ dates }) => {
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
              {calendar.todos.map((todo, index) => (
                <ListItemTaskTodo
                  key={index}
                  calendar={calendar}
                  date={date}
                  todo={todo}
                  showButtonToOpenInDatePanel
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
