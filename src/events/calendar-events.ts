const CalendarUpdatedEventName: string = 'calendarUpdated'
type CalendarUpdatedEventDetailsType = { calendarId: number }
export type CalendarUpdatedEventFnType = (
  event: CustomEvent<CalendarUpdatedEventDetailsType>
) => void

export const fireEventCalendarUpdated = (calendarId: number) => {
  window.dispatchEvent(
    new CustomEvent<CalendarUpdatedEventDetailsType>(CalendarUpdatedEventName, {
      detail: {
        calendarId,
      },
    })
  )
}

export const subscribeToCalendarUpdates = (fn: CalendarUpdatedEventFnType) => {
  // @ts-ignore
  window.addEventListener(CalendarUpdatedEventName, fn)
}
export const unsubscribeToCalendarUpdates = (
  fn: CalendarUpdatedEventFnType
) => {
  // @ts-ignore
  window.removeEventListener(CalendarUpdatedEventName, fn)
}
