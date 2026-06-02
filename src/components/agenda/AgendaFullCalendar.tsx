import { FC } from 'react'
import { TCalendar } from '@/remote/sdk/types'
import { ListItemTaskDone } from './ListItemTaskDone'

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
      </div>
    </div>
  )
}
