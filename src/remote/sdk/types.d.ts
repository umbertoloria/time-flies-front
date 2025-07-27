// Types
// 2025-07-27T14:27:54Z
// v3.3

// Calendar
export type TCalendar = TCalendarCh & {
  children?: TCalendarCh[]
}
type TCalendarCh = {
  id: number
  name: string
  color: string
  plannedColor: string
  usesNotes?: boolean
  days: TDay[]
  plannedDays?: TDay[]
}
export type TDay = {
  date: string // Es. "2023-01-01"
  notes?: string
}
// Todos
export type TNewTodo = {
  id: number
  // date: string
  notes?: string
}
export type TNewDoneTask = {
  id: number
  // date: string
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
  // Read Planned Events Response
  export type ReadPlannedEventsResponse = {
    dates: ReadPlannedEventsResponseDateBox[]
  }
  export type ReadPlannedEventsResponseDateBox = {
    date: string
    calendars: ReadPlannedEventsResponseCalendar[]
  }
  export type ReadPlannedEventsResponseCalendar = {
    id: number
    name: string
    color: string
    todos: TNewTodo[]
  }
  // Read Date Response
  export type ReadDateResponse = {
    date: string
    calendar: {
      id: number
      name: string
      usesNotes?: boolean
    }
    doneTasks: TNewDoneTask[]
    todos: TNewTodo[]
  }
}
