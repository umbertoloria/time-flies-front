import { FC, useEffect, useState } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { useWrapperForCreateResource } from './HomePage.tsx'
import { readDateSchedule } from '../remote/remote.ts'
import { ScheduleContent } from '../components/schedule/ScheduleContent.tsx'
import {
  getTodayLocalDate,
  isLocalDateToday,
  isLocalDateYesterday,
} from '../lib/utils.ts'
import {
  ScheduleProvider,
  useScheduleContext,
} from '../components/schedule/ScheduleContext.tsx'
import {
  CustomEventTypeReloadSchedulePage,
  subscribeReloadSchedulePage,
  unsubscribeReloadSchedulePage,
} from '../components/schedule/event-reload-schedule-page.ts'
import { CustomEventFnType } from '../events/calendar-events.ts'

const periodRefreshScheduleInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function SchedulePage() {
  return (
    <UserLayout>
      <ScheduleProvider>
        <InnerPage />
      </ScheduleProvider>
    </UserLayout>
  )
}

const InnerPage: FC = () => {
  // Input Schedule
  const [inputDateValue, setInputDateValue] = useState(getTodayLocalDate())
  const canInputThings =
    isLocalDateToday(inputDateValue) || isLocalDateYesterday(inputDateValue)

  const { setSchedule, setExerciseGroup } = useScheduleContext()

  // Schedule
  const [dataSchedule, { refetch: refreshSchedule }] =
    useWrapperForCreateResource(() =>
      readDateSchedule(inputDateValue, canInputThings)
    )
  useEffect(() => {
    refreshSchedule()
  }, [inputDateValue])
  const refreshScheduleIntervalTimer = setInterval(() => {
    refreshSchedule()
  }, periodRefreshScheduleInMillis)
  useEffect(() => {
    const handleReloadPage: CustomEventFnType<
      CustomEventTypeReloadSchedulePage
    > = () => {
      refreshSchedule()
    }

    subscribeReloadSchedulePage(handleReloadPage)
    return () => {
      clearInterval(refreshScheduleIntervalTimer)
      unsubscribeReloadSchedulePage(handleReloadPage)
    }
  }, [])

  // Updating Schedule Context
  useEffect(() => {
    setInputDateValue(inputDateValue)
    if (dataSchedule?.data) {
      setSchedule(dataSchedule.data.schedule)
      setExerciseGroup(dataSchedule.data.allExerciseGroups)
    }
  }, [inputDateValue, dataSchedule])

  return (
    <section className='p-8'>
      <div className='w-full'>
        <div className='text-center'>
          <form className='mx-auto my-4 w-fit p-3 bg-gray-100 rounded-lg'>
            <span className='pr-2'>{'Data: '}</span>
            <input
              type='date'
              className='px-2 py-1 rounded-md'
              value={inputDateValue}
              onInput={event => {
                const newDate = event.currentTarget.value // Es. "2024-11-15"
                // TODO: Check if it's valid
                setInputDateValue(newDate)
              }}
            />
          </form>
        </div>
        <ScheduleContent canInputThings={canInputThings} />
      </div>
    </section>
  )
}
