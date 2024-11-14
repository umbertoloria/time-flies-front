import { FC, useEffect } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { useWrapperForCreateResource } from './HomePage.tsx'
import { readSchedule } from '../remote/remote.ts'
import { ScheduleContent } from '../components/schedule/ScheduleContent.tsx'

const periodRefreshScheduleInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function SchedulePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const InnerPage: FC = () => {
  // Schedule
  const [dataSchedule, { refetch: refreshSchedule }] =
    useWrapperForCreateResource(() => readSchedule('2024-10-10'))

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
      <div className='container w-full'>
        {!!dataSchedule?.data && (
          <ScheduleContent schedule={dataSchedule.data} />
        )}
      </div>
    </section>
  )
}
