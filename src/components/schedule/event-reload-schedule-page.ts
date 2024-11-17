import { buildCustomEvent } from '../../events/event-builder.ts'

export type CustomEventTypeReloadSchedulePage = undefined
export const {
  subscribe: subscribeReloadSchedulePage,
  unsubscribe: unsubscribeReloadSchedulePage,
  fire: fireReloadSchedulePage,
} = buildCustomEvent<CustomEventTypeReloadSchedulePage>('ReloadSchedulePage')
