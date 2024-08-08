// Types
// 2024-08-08T17:37:40Z
// v2.2

// Calendar
export type TCalendar = {
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
