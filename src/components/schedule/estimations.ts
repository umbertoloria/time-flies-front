import { TExerciseGroup, TExerciseRecord } from '../../remote/sdk/types'

export function estimate_exercise_group_duration_minutes(
  exerciseGroup: TExerciseGroup
) {
  let result = 0
  for (const exercise of exerciseGroup.exercises) {
    if (!exercise.records || !exercise.records.length) {
      continue
    }
    const min_for_exercise = estimate_record_list_duration_minutes(
      exercise.records
    )
    if (!min_for_exercise || min_for_exercise <= 0) {
      continue
    }
    result += min_for_exercise
  }
  if (result === 0) {
    return undefined
  }
  return safe_round_num_2digits(result)
}

export function estimate_record_list_duration_minutes(
  records: TExerciseRecord[]
): number | undefined {
  if (records.every(record => record.bars_num == undefined)) {
    return undefined
  }
  return safe_round_num_2digits(
    records
      .map(record => estimate_record_duration_minutes(record))
      .reduce((a, b) => a + b, 0)
  )
}

export function estimate_record_duration_minutes(
  record: TExerciseRecord
): number {
  const num_bars = record.bars_num || 0
  const quarters_num_in_1bar = record.ts_above || 1
  if (record.bars_num === 0 || quarters_num_in_1bar === 0) {
    // This should never happen.
    return 0
  }
  const duration_sec_1quarter = 60.0 / record.bpm
  const duration_sec_1bar = duration_sec_1quarter * quarters_num_in_1bar
  const duration_sec_whole_exercise = duration_sec_1bar * num_bars
  const duration_min_fl_whole_exercise = duration_sec_whole_exercise / 60.0
  return safe_round_num_2digits(duration_min_fl_whole_exercise)
}

function safe_round_num_2digits(unsafe: number): number {
  return Math.round(unsafe * 100.0) / 100.0
}

export function displayDuration(minutes: number) {
  const intHours = Math.floor(minutes / 60.0)
  const seconds = (minutes - intHours * 60.0) * 60.0
  const intMinutes = Math.floor(seconds / 60.0)
  const intSeconds = Math.round(seconds - intMinutes * 60.0)

  if (intHours > 0) {
    // Prefer not to specify seconds here...
    const roundedIntMinutes = Math.round(intMinutes + intSeconds / 60.0)
    return `${intHours}h ${roundedIntMinutes}m`
  }
  return `${intMinutes}m ${intSeconds}s`
}
