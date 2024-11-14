// Types
// 2024-11-14T22:27:22Z
// v2.6

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
  records?: TExerciseRecord[]
}
export type TExerciseRecord = {
  id: number
  bpm: number
  minutes?: number
  hand?: 'dx' | 'sx'
}

// Auth
export type TAuthStatus = {
  user: TAuthUser
}
export type TAuthUser = {
  id: number
  email: string
}

// SDK: Calendar
export namespace TCalendarSDK {
  export type CheckDateWithSuccessPromiseOutput = 'invalid' | 'ok'
}
