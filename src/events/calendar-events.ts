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

// GENERIC
// TODO: Use more these generic functions
export function subscribeEvent(eventName: string, listener: () => void) {
  window.addEventListener(eventName, listener)
}

export function unsubscribeEvent(eventName: string, listener: () => void) {
  window.removeEventListener(eventName, listener)
}

export function fireEvent(eventName: string, data?: object) {
  const event = new CustomEvent(eventName, {
    detail: data,
  })
  window.dispatchEvent(event)
}

export function createEventsManager(eventName: string) {
  return {
    subscribe(listener: () => void) {
      subscribeEvent(eventName, listener)
    },
    unsubscribe(listener: () => void) {
      unsubscribeEvent(eventName, listener)
    },
    fire(data?: object) {
      fireEvent(eventName, data)
    },
  }
}
