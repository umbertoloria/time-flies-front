// SPECIFIC
import {
  fireEvent,
  subscribeEvent,
  unsubscribeEvent,
} from '../../events/calendar-events.ts'

const eventNameReloadSchedulePageDate = 'ReloadSchedulePage' as const

export function subscribeReloadSchedulePage(listener: () => void) {
  subscribeEvent(eventNameReloadSchedulePageDate, listener)
}

export function unsubscribeReloadSchedulePage(listener: () => void) {
  unsubscribeEvent(eventNameReloadSchedulePageDate, listener)
}

export function fireReloadSchedulePageEvent() {
  fireEvent(eventNameReloadSchedulePageDate)
}
