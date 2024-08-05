export function getDayCodeByDate(date: Date) {
  return getDayCode(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function getDayCode(year: number, month: number, day: number) {
  return (
    `${year}` +
    `-${month.toString().padStart(2, '0')}` +
    `-${day.toString().padStart(2, '0')}`
  )
}

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
  return getDayCodeByDate(aDate) === getDayCodeByDate(bDate)
}

export function getNowDate() {
  return new Date()
}

export function getITMonthFromLocalDate(localDate: string): string {
  const date = new Date(localDate)
  const formatter = new Intl.DateTimeFormat('it-IT', { month: 'short' })
  return formatter.format(date)
}
