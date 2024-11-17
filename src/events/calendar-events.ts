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
export type CustomEventFnType<T> = (event: CustomEvent<T>) => void

function subscribeEvent<T>(eventName: string, listener: CustomEventFnType<T>) {
  // @ts-ignore
  window.addEventListener(eventName, listener)
}

function unsubscribeEvent<T>(
  eventName: string,
  listener: CustomEventFnType<T>
) {
  // @ts-ignore
  window.removeEventListener(eventName, listener)
}

function fireEvent<T>(eventName: string, data: T) {
  const event = new CustomEvent<T>(eventName, {
    detail: data,
  })
  window.dispatchEvent(event)
}

export function createEventsManager<T>(eventName: string) {
  return {
    subscribe(listener: CustomEventFnType<T>) {
      subscribeEvent(eventName, listener)
    },
    unsubscribe(listener: CustomEventFnType<T>) {
      unsubscribeEvent(eventName, listener)
    },
    fire(data: T) {
      fireEvent(eventName, data)
    },
  }
}
