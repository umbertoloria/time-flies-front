import { FC } from 'react'
import { TExercise, TExerciseRecord } from '../../remote/sdk/types'
import { ExerciseRecord } from './ExerciseRecord.tsx'

export const Exercise: FC<{
  exercise: TExercise
}> = props => {
  return (
    <div className='border-2 border-gray-200 rounded-md p-2 pt-1 bg-gray-100'>
      <span className='text-lg font-bold'>{props.exercise.name}</span>
      {!!props.exercise.records && (
        <ExerciseRecordsList records={props.exercise.records} />
      )}
    </div>
  )
}

const ExerciseRecordsList: FC<{
  records: TExerciseRecord[]
}> = props => {
  return (
    <div className='mt-1 flex flex-col gap-1'>
      {props.records.map((record, index) => (
        <ExerciseRecord key={index} record={record} />
      ))}
    </div>
  )
}
