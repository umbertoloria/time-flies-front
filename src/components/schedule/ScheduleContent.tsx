import { FC } from 'react'
import { ExerciseGroup } from './ExerciseGroup.tsx'
import { useScheduleContext } from './ScheduleContext.tsx'

export const ScheduleContent: FC = () => {
  const { schedule, exerciseGroup } = useScheduleContext()
  if (!schedule || !exerciseGroup) {
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
                <ExerciseGroup key={index} exerciseGroup={exerciseGroup} />
              ))}
            </div>
          </div>
        </>
      )}
      {!!exerciseGroup && (
        <>
          {exerciseGroup.map((exerciseGroup, index) => (
            <ExerciseGroup key={index} exerciseGroup={exerciseGroup} />
          ))}
        </>
      )}
    </>
  )
}
