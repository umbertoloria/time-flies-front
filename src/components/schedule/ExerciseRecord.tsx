import { FC, PropsWithChildren, useState } from 'react'
import { TExerciseRecord } from '../../remote/sdk/types'
import classNames from 'classnames'
import { createExerciseRecord } from '../../remote/remote.ts'
import { useScheduleContext } from './ScheduleContext.tsx'
import { fireReloadSchedulePage } from './event-reload-schedule-page.ts'

const ExerciseRecordBase: FC<
  PropsWithChildren<{
    hasHover?: boolean
  }>
> = props => {
  return (
    <div
      className={classNames('exercise-record', {
        'has-hover': props.hasHover,
      })}
    >
      {props.children}
    </div>
  )
}

export const ExerciseRecord: FC<{
  record: TExerciseRecord
}> = props => {
  return (
    <ExerciseRecordBase>
      <ExerciseRecordContent record={props.record} />
    </ExerciseRecordBase>
  )
}

export const ExerciseRecordRowToAddNew: FC<{
  exerciseId: number
}> = props => {
  const { localDate } = useScheduleContext()
  const [bpm, setBpm] = useState(60)
  const [isLoading, setLoading] = useState(false)
  return (
    <ExerciseRecordBase>
      {/* BPM */}
      <ColouredLabel bold>
        <input
          type='number'
          min={50}
          max={400}
          className='inline'
          value={bpm}
          onInput={event => {
            if (isLoading) {
              return
            }
            const strValue = event.currentTarget.value
            const parsed = parseInt(strValue)
            if (!isNaN(parsed) && 50 <= bpm && bpm <= 400) {
              setBpm(parsed)
            }
          }}
          disabled={isLoading}
        />
        {' bpm'}
      </ColouredLabel>

      <button
        className='btn-primary'
        onClick={() => {
          setLoading(true)
          // TODO: Validate params
          createExerciseRecord(props.exerciseId, localDate, {
            bpm,
          })
            .then(response => {
              if (response === 'invalid-bpm') {
                alert('Input non valido: bpm')
              } else {
                // Yay!
                // TODO: Tell user all went OK
                fireReloadSchedulePage()
              }
              setLoading(false)
            })
            .catch(err => {
              console.error(err)
              // TODO: Tell user all went KO
              alert('Errore avvenuto')
              setLoading(false)
            })
        }}
      >
        Fatto
      </button>
    </ExerciseRecordBase>
  )
}

export const ExerciseRecordContent: FC<{
  record: TExerciseRecord
}> = props => {
  return (
    <>
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
    </>
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
