// Types
// 2025-01-06T18:44:48Z
// v2.9

// Calendar
export type TCalendar = TCalendarCh & {
  children?: TCalendarCh[]
}
type TCalendarCh = {
  id: number
  name: string
  color: string
  plannedColor: string
  days: TDay[]
  plannedDays?: TDay[]
}
export type TDay = {
  date: string // Es. "2023-01-01"
  intensity?: number
  notes?: string
}

// Schedule
export type TSchedule = {
  groups: TExerciseGroup[]
}
export type TExerciseGroup = {
  id: number
  name: string
  exercises: TExercise[]
}
export type TExercise = {
  id: number
  name: string
  gc?: {
    bass: string // Es. "xx-x----"
    ghost: string // Es. "-xx-xx-x"
    hhr: string // Es, "W-vvW-vv"
    cymbal: 'hh' | 'ride' // Es. "hh" | "ride"
  }
  records?: TExerciseRecord[]
}
export type TExerciseRecord = {
  id: number
  bpm: number
  minutes?: number
  hand?: 'dx' | 'sx'
  bars_num?: number
  ts_above?: number
  ts_below?: number
}
export type TEvent = {
  id: number
  date: string
  done_date?: string
  calendar: {
    id: number
    name: string
    color: string
  }
}

// Auth
export type TAuthStatus = {
  user: TAuthUser
}
export type TAuthUser = {
  id: number
  email: string
}

// SDK: Schedule
export namespace TScheduleSDK {
  export type ReadScheduleAndAllExerciseGroups = {
    schedule: TSchedule
    allExerciseGroups: TExerciseGroup[]
  }
}
export namespace TCalendarSDK {
  export type ReadPlannedEventsRequest = {
    onlyToday?: boolean
  }
  export type ReadPlannedEventsResponse = {
    events: TEvent[]
  }
}
