import { FC } from 'react'
import { TExerciseGroup } from '../../remote/sdk/types'
import { Exercise } from './Exercise.tsx'
import {
  displayDuration,
  estimate_exercise_group_duration_minutes,
} from './estimations.ts'
import { ColouredLabel } from './ExerciseRecord.tsx'

export const ExerciseGroup: FC<{
  exerciseGroup: TExerciseGroup
  addRecords?: boolean
}> = props => {
  const total_estimation = estimate_exercise_group_duration_minutes(
    props.exerciseGroup
  )

  return (
    <div className='border-gray-300 py-2 pl-3 bg-gray-100 rounded-md'>
      <div className='text-lg'>
        <span className='font-bold'>{props.exerciseGroup.name}</span>
        {!!total_estimation && (
          <>
            {' '}
            <ColouredLabel>{displayDuration(total_estimation)}</ColouredLabel>
          </>
        )}
      </div>
      {/* // TODO: Responsive number of columns */}
      <div className='mt-1 grid grid-cols-3 gap-3'>
        {props.exerciseGroup.exercises.map((subExercise, index) => (
          <Exercise
            key={index}
            exercise={subExercise}
            addRecords={props.addRecords}
          />
        ))}
      </div>
    </div>
  )
}
