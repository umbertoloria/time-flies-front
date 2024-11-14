import { FC } from 'react'
import { TSchedule } from '../../remote/sdk/types'
import { ExerciseGroup } from './ExerciseGroup.tsx'

export const ScheduleContent: FC<{
  // title: string
  schedule: TSchedule
}> = props => {
  return (
    <div>
      {/*<span className='text-lg font-bold'>{props.title}</span>*/}
      <div className='mt-2'>
        {props.schedule.groups.map((exerciseGroup, index) => (
          <ExerciseGroup key={index} exerciseGroup={exerciseGroup} />
        ))}
      </div>
    </div>
  )
}
