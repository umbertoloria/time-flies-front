import { FC } from 'react'
import { TCalendarSDK } from '@/remote/sdk/types'
import { useDialogForInsertNewGoal } from '@/context/dialog-insert-new-goal/ContextDialogForInsertNewGoal'
import { useDialogForInsertNewPlannedEvent } from '@/context/dialog-insert-new-planned-event/ContextDialogForInsertNewPlannedEvent'
import { ListItemTaskDone } from './ListItemTaskDone'
import { ListItemTaskTodo } from './ListItemTaskTodo'

export const AgendaSingleDate: FC<{
  data: TCalendarSDK.ReadDateResponse
}> = ({ data }) => {
  const { calendar, date } = data
  const { openDialog: openDialogForInsertNewGoal } = useDialogForInsertNewGoal()
  const { openDialog: openDialogForInsertNewPlannedEvent } =
    useDialogForInsertNewPlannedEvent()

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

        {/* Show all Todos */}
        {data.todos.map((todo, index) => (
          <ListItemTaskTodo
            key={index}
            calendar={calendar}
            date={date}
            todo={todo}
          />
        ))}

        {/* Show all Done Tasks */}
        {(data.doneTasks || []).map((doneTask, index) => (
          <ListItemTaskDone
            key={index}
            calendar={calendar}
            date={date}
            taskId={doneTask.id}
            notes={doneTask.notes}
          />
        ))}
      </div>

      {data.doneTasks.length === 0 && data.todos.length === 0 && (
        <div>
          <button
            className='btn-primary'
            onClick={() => {
              openDialogForInsertNewGoal(
                calendar.id,
                calendar.usesNotes || false,
                date
              )
            }}
          >
            {'Add done task'}
          </button>
          <button
            className='btn-primary ml-1'
            onClick={() => {
              openDialogForInsertNewPlannedEvent(
                calendar.id,
                calendar.usesNotes || false,
                date
              )
            }}
          >
            {'Add todo'}
          </button>
        </div>
      )}
    </div>
  )
}
