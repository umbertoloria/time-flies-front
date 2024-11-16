import { FC } from 'react'
import { ExerciseGroup } from './ExerciseGroup.tsx'
import { useScheduleContext } from './ScheduleContext.tsx'

export const ScheduleContent: FC<{
  canInputThings?: boolean
}> = props => {
  const { schedule, exerciseGroup: allExerciseGroup } = useScheduleContext()
  if (!schedule) {
    return <></>
  }
  return (
    <>
      {schedule.groups.length === 0 ? (
        <>
          <p className='text-center'>Nessuna informazione trovata.</p>
        </>
      ) : (
        <>
          <div>
            {/*<span className='text-lg font-bold'>{props.title}</span>*/}
            <div className='mt-2'>
              {schedule.groups.map((exerciseGroup, index) => (
                <ExerciseGroup
                  key={index}
                  exerciseGroup={exerciseGroup}
                  addRecords={props.canInputThings}
                />
              ))}
            </div>
          </div>
        </>
      )}
      {!!allExerciseGroup && (
        <>
          {allExerciseGroup.map((exerciseGroup, index) => (
            <ExerciseGroup
              key={index}
              exerciseGroup={exerciseGroup}
              addRecords={props.canInputThings}
            />
          ))}
        </>
      )}
    </>
  )
}
