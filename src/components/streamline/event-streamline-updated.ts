import { buildCustomEvent } from '../../events/event-builder.ts'

export const {
  subscribe: subscribeToStreamlineUpdates,
  unsubscribe: unsubscribeToStreamlineUpdates,
  fire: fireEventStreamlineUpdated,
} = buildCustomEvent<undefined>('StreamlineUpdated')
