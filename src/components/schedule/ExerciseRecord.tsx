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
  const [isLoading, setLoading] = useState(false)

  // Inputs
  const [bpm, setBpm] = useState(60)
  const [minutes, setMinutes] = useState<undefined | number>(undefined)
  const isMinutesInputFilled = typeof minutes === 'number'
  const clearInput = () => {
    setBpm(60)
    setMinutes(undefined)
  }

  return (
    <ExerciseRecordBase>
      {/* BPM */}
      <ColouredLabel bold>
        <input
          type='number'
          min={50}
          max={400}
          className='inline max-w-8'
          value={bpm}
          onInput={event => {
            if (isLoading) {
              return
            }
            const parsedBpm = parseInt(event.currentTarget.value)
            if (!isNaN(parsedBpm) && 50 <= parsedBpm && parsedBpm <= 400) {
              setBpm(parsedBpm)
            } else {
              setBpm(60)
            }
          }}
          disabled={isLoading}
        />
        {' bpm'}
      </ColouredLabel>

      {/* Minutes */}
      <ColouredLabel blurText={!isMinutesInputFilled}>
        <input
          type='checkbox'
          className='inline'
          onChange={event => {
            const checked = event.currentTarget.checked
            if (checked) {
              setMinutes(2)
            } else {
              setMinutes(undefined)
            }
          }}
          checked={minutes !== undefined}
        />
        <input
          type='number'
          min={1}
          max={90}
          className='inline max-w-8'
          value={isMinutesInputFilled ? minutes : 0}
          onInput={event => {
            if (isLoading) {
              return
            }
            const parsMinutes = parseInt(event.currentTarget.value)
            if (!isNaN(parsMinutes) && 1 <= parsMinutes && parsMinutes <= 90) {
              setMinutes(parsMinutes)
            } else {
              setMinutes(undefined)
            }
          }}
          disabled={isLoading || !isMinutesInputFilled}
        />
        {' minuti'}
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
              } else if (response === 'invalid-minutes') {
                alert('Input non valido: minutes')
              } else {
                // Yay!
                // TODO: Tell user all went OK
                clearInput()
                fireReloadSchedulePage(undefined)
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
      <ColouredLabel bold>{`${props.record.bpm} bpm`}</ColouredLabel>

      {/* Minutes */}
      {props.record.minutes !== undefined && (
        <ColouredLabel>{`${props.record.minutes} minuti`}</ColouredLabel>
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
    blurText?: boolean
  }>
> = props => {
  return (
    <span
      className={classNames(
        'inline-block text-xs px-1.5 py-0.5 rounded-md border-2 border-gray-300',
        {
          'font-bold': props.bold,
          'text-gray-500': props.blurText,
        }
      )}
    >
      {props.children}
    </span>
  )
}
