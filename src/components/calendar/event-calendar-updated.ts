import { buildCustomEvent } from '../../events/event-builder.ts'

export type CustomEventTypeCalendarUpdated = { calendarId: number }
export const {
  subscribe: subscribeToCalendarUpdates,
  unsubscribe: unsubscribeToCalendarUpdates,
  fire: fireEventCalendarUpdated,
} = buildCustomEvent<CustomEventTypeCalendarUpdated>('CalendarUpdated')
