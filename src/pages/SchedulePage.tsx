import { FC, useEffect, useState } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { useWrapperForCreateResource } from '../lib/remote-resources.ts'
import { getSDK } from '../remote/remote.ts'
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
import { CustomEventFnType } from '../events/event-builder.ts'
import { CalendarForScheduler } from '../components/schedule/CalendarForScheduler.tsx'

const periodRefreshDatesWithRecordsInMillis = 3 * 60 * 60 * 1000 // 3 minutes.
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

const { readDateSchedule, readDaysWithExerciseRecords } = getSDK()
const InnerPage: FC = () => {
  // Input Schedule
  const [inputDateValue, setInputDateValue] = useState(getTodayLocalDate())
  const canInputThings =
    isLocalDateToday(inputDateValue) || isLocalDateYesterday(inputDateValue)

  const { setSchedule, setExerciseGroup } = useScheduleContext()

  // Dates with Records
  const [dataDatesWithRecords, { refetch: refreshDatesWithRecords }] =
    useWrapperForCreateResource(() => readDaysWithExerciseRecords())
  useEffect(() => {
    const refreshDatesWithRecordsIntervalTimer = setInterval(
      refreshDatesWithRecords,
      periodRefreshDatesWithRecordsInMillis
    )
    return () => {
      clearInterval(refreshDatesWithRecordsIntervalTimer)
    }
  }, [])

  // Schedule
  const [dataSchedule, { refetch: refreshSchedule }] =
    useWrapperForCreateResource(() =>
      readDateSchedule(inputDateValue, canInputThings)
    )
  useEffect(() => {
    const refreshScheduleIntervalTimer = setInterval(
      refreshSchedule,
      periodRefreshScheduleInMillis
    )
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
  useEffect(() => {
    refreshSchedule()
  }, [inputDateValue])

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
        <div className='mt-1 flex flex-wrap gap-3 justify-start'>
          {/* Left Part */}
          <div>
            <CalendarForScheduler
              datesWithRecords={dataDatesWithRecords?.data.dates || []}
              setLocalDate={setInputDateValue}
            />
            <div className='bg-gray-200 rounded-sm'>
              <form className='mx-auto my-4 w-fit p-3 rounded-lg'>
                {/* // TODO: Duplicated code (*mkld) */}
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
          </div>

          {/* Right Part */}
          <div className='flex-grow '>
            <ScheduleContent canInputThings={canInputThings} />
          </div>
        </div>
      </div>
    </section>
  )
}
