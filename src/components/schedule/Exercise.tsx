import { FC } from 'react'
import { TExercise, TExerciseRecord } from '../../remote/sdk/types'
import { ExerciseRecord, ExerciseRecordRowToAddNew } from './ExerciseRecord.tsx'
import {
  displayDuration,
  estimate_record_list_duration_minutes,
} from './estimations.ts'
import { useUXDialogForGroover } from '../../context/UXContextDialogForGroover.tsx'
import { ColouredLabel } from '../coloured/ColouredLabel.tsx'

export const Exercise: FC<{
  exercise: TExercise
  addRecords?: boolean
}> = props => {
  let total_estimation: number | undefined = undefined
  if (props.exercise.records && props.exercise.records.length) {
    total_estimation = estimate_record_list_duration_minutes(
      props.exercise.records
    )
  }

  const { openDialog } = useUXDialogForGroover()

  return (
    <div className='border-2 border-gray-200 rounded-md p-2 pt-1 bg-gray-100'>
      <div className='text-lg max-w-80'>
        {props.exercise.gc ? (
          <>
            <ColouredLabel>
              {'Bass: '}
              {props.exercise.gc.bass}
            </ColouredLabel>{' '}
            <ColouredLabel>
              {'Ghost: '}
              {props.exercise.gc.ghost}
            </ColouredLabel>{' '}
            <ColouredLabel>
              {props.exercise.gc.cymbal === 'ride' ? 'Ride: ' : 'HH: '}
              {props.exercise.gc.hhr}
            </ColouredLabel>
            <button
              className='btn-primary ml-2'
              onClick={() => {
                if (props.exercise.gc) {
                  openDialog({
                    bass: props.exercise.gc.bass,
                    ghost: props.exercise.gc.ghost,
                    hhr: props.exercise.gc.hhr,
                  })
                }
              }}
            >
              {/* // TODO: Icons in this project */}
              {'I'}
            </button>
          </>
        ) : (
          <span className='font-bold'>{props.exercise.name}</span>
        )}
        {!!total_estimation && (
          <>
            {' '}
            <ColouredLabel>{displayDuration(total_estimation)}</ColouredLabel>
          </>
        )}
      </div>
      {(!!props.exercise.records || props.addRecords) && (
        <ExerciseRecordsList
          exerciseId={props.exercise.id}
          records={props.exercise.records || []}
          addRecords={props.addRecords}
        />
      )}
    </div>
  )
}

const ExerciseRecordsList: FC<{
  exerciseId: number
  records: TExerciseRecord[]
  addRecords?: boolean
}> = props => {
  return (
    <div className='mt-1 flex flex-col gap-1'>
      {props.records.map((record, index) => (
        <ExerciseRecord key={index} record={record} />
      ))}
      {props.addRecords && (
        <>
          <ExerciseRecordRowToAddNew exerciseId={props.exerciseId} />
        </>
      )}
    </div>
  )
}
