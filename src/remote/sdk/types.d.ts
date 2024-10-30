// Types
// 2024-10-30T15:39:55Z
// v2.3

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
