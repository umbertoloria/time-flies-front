// LOCAL DATE
function getLocalDate(year: number, month: number, day: number) {
  // Es. dayCode="2024-06-08"
  return (
    `${year}` +
    `-${month.toString().padStart(2, '0')}` +
    `-${day.toString().padStart(2, '0')}`
  )
}

export function getLocalDayByDate(date: Date) {
  return getLocalDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getDateFromLocalDate(localDate: string) {
  // Es. localDate="2024-08-06"
  return new Date(localDate)
}

export function getITMonthFromLocalDate(localDate: string): string {
  const date = new Date(localDate)
  const formatter = new Intl.DateTimeFormat('it-IT', { month: 'short' })
  return formatter.format(date)
}

// DATE COMPARISONS
export function localDatesLTE(aLocalDate: string, bLocalDate: string) {
  return datesLTE(new Date(aLocalDate), new Date(bLocalDate))
}

export function localDatesLT(aLocalDate: string, bLocalDate: string) {
  return datesLT(new Date(aLocalDate), new Date(bLocalDate))
}

function datesLTE(aDate: Date, bDate: Date) {
  return aDate.getTime() <= bDate.getTime()
}

function datesLT(aDate: Date, bDate: Date) {
  return aDate.getTime() < bDate.getTime()
}

export function datesInTheSameDay(aDate: Date, bDate: Date) {
  return getLocalDayByDate(aDate) === getLocalDayByDate(bDate)
}

// TODAYs AND YESTERDAYs
export function isDateToday(date: Date) {
  return datesInTheSameDay(date, getTodayDate())
}

export function isLocalDateToday(localDate: string) {
  return datesInTheSameDay(getDateFromLocalDate(localDate), getTodayDate())
}

export function getDateWithOffsetDays(fromDate: Date, offset: number) {
  const result = new Date(fromDate)
  result.setDate(result.getDate() + offset)
  return result
}

export function isLocalDateYesterday(localDate: string) {
  const yesterdayDate = getDateWithOffsetDays(getTodayDate(), -1)
  return datesInTheSameDay(getDateFromLocalDate(localDate), yesterdayDate)
}

// TODAY DATE
export function getNowDate() {
  return new Date()
}

export function getTodayLocalDate() {
  return getLocalDayByDate(getNowDate())
}

export function getTodayDate() {
  return getDateFromLocalDate(getTodayLocalDate())
}
