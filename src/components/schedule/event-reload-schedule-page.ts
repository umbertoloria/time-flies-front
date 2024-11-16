import { createEventsManager } from '../../events/calendar-events.ts'

export const {
  subscribe: subscribeReloadSchedulePage,
  unsubscribe: unsubscribeReloadSchedulePage,
  fire: fireReloadSchedulePage,
} = createEventsManager<undefined>('ReloadSchedulePage' as const)
