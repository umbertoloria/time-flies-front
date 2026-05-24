import { buildCustomEvent } from '@/events/event-builder'

export const {
  subscribe: subscribeToStreamlineUpdates,
  unsubscribe: unsubscribeToStreamlineUpdates,
  fire: fireEventStreamlineUpdated,
} = buildCustomEvent<undefined>('StreamlineUpdated')
