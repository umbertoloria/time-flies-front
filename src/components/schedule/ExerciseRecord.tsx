import { FC, PropsWithChildren } from 'react'
import { TExerciseRecord } from '../../remote/sdk/types'
import classNames from 'classnames'

export const ExerciseRecord: FC<{
  record: TExerciseRecord
}> = props => {
  return (
    <div className='bg-gray-200 px-1 py-1 rounded-md flex flex-wrap gap-2 items-center'>
      {/* BPM */}
      <ColouredLabel bold>{props.record.bpm} bpm</ColouredLabel>

      {/* Minutes */}
      {props.record.minutes !== undefined && (
        <ColouredLabel>{props.record.minutes} minuti</ColouredLabel>
      )}

      {/* Hand: dx/sx */}
      {props.record.hand !== undefined && (
        <>
          {!!props.record.hand && (
            <ColouredLabel>
              {props.record.hand == 'sx' ? 'Mano sinistra' : 'Mano destra'}
            </ColouredLabel>
          )}
        </>
      )}
    </div>
  )
}

const ColouredLabel: FC<
  PropsWithChildren<{
    bold?: boolean
  }>
> = props => {
  return (
    <span
      className={classNames(
        'inline-block text-xs max-w-24 px-1.5 py-0.5 rounded-md border-2 border-gray-300',
        {
          'font-bold': props.bold,
        }
      )}
    >
      {props.children}
    </span>
  )
}
