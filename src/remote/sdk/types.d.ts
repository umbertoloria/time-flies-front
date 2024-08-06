// Types
// 2024-08-06T09:41:56Z
// v2.1

// Calendar
export type TCalendar = {
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
