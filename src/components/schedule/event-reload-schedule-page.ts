import { createEventsManager } from '../../events/calendar-events.ts'

export type CustomEventTypeReloadSchedulePage = undefined
export const {
  subscribe: subscribeReloadSchedulePage,
  unsubscribe: unsubscribeReloadSchedulePage,
  fire: fireReloadSchedulePage,
} = createEventsManager<CustomEventTypeReloadSchedulePage>('ReloadSchedulePage')
