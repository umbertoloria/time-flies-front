import { FC } from 'react'
import { TExerciseGroup } from '../../remote/sdk/types'
import { Exercise } from './Exercise.tsx'

export const ExerciseGroup: FC<{
  exerciseGroup: TExerciseGroup
  addRecords?: boolean
}> = props => {
  return (
    <div className='border-gray-300 py-2 pl-3 bg-gray-100 rounded-md'>
      <span className='text-lg font-bold'>{props.exerciseGroup.name}</span>
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
