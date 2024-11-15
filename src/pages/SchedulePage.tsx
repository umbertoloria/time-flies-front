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
import { ExerciseGroup } from '../components/schedule/ExerciseGroup.tsx'

const periodRefreshScheduleInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function SchedulePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const InnerPage: FC = () => {
  // Input Schedule
  const [inputDateValue, setInputDateValue] = useState(getTodayLocalDate())
  const canInputThings =
    isLocalDateToday(inputDateValue) || isLocalDateYesterday(inputDateValue)

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
          <>
            <ScheduleContent schedule={dataSchedule.data.schedule} />
            {dataSchedule.data.allExerciseGroups.map((exerciseGroup, index) => (
              <ExerciseGroup key={index} exerciseGroup={exerciseGroup} />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
