import { FC, useEffect, useState } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { useWrapperForCreateResource } from './HomePage.tsx'
import { readSchedule } from '../remote/remote.ts'
import { ScheduleContent } from '../components/schedule/ScheduleContent.tsx'
import { getTodayLocalDate } from '../lib/utils.ts'

const periodRefreshScheduleInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function SchedulePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const InnerPage: FC = () => {
  const [inputDateValue, setInputDateValue] = useState(getTodayLocalDate())

  // Schedule
  const [dataSchedule, { refetch: refreshSchedule }] =
    useWrapperForCreateResource(() => readSchedule(inputDateValue))
  useEffect(() => {
    refreshSchedule()
  }, [inputDateValue])
  const refreshScheduleIntervalTimer = setInterval(() => {
    refreshSchedule()
  }, periodRefreshScheduleInMillis)
  useEffect(() => {
    return () => {
      clearInterval(refreshScheduleIntervalTimer)
    }
  }, [])

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
        {!!dataSchedule?.data && (
          <ScheduleContent schedule={dataSchedule.data} />
        )}
      </div>
    </section>
  )
}
