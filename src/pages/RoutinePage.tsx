import { FC, useEffect } from 'react'
import { UserLayout } from '../layout/UserLayout.tsx'
import { useWrapperForCreateResource } from './HomePage.tsx'
import { readSchedule } from '../remote/remote.ts'
import { ScheduleContent } from '../components/schedule/ScheduleContent.tsx'

const periodRefreshScheduleInMillis = 10 * 60 * 60 * 1000 // 10 minutes.

export default function RoutinePage() {
  return (
    <UserLayout>
      <InnerPage />
    </UserLayout>
  )
}

const InnerPage: FC = () => {
  // Schedules
  const [dataSchedule, { refetch: refreshSchedule }] =
    useWrapperForCreateResource(1, readSchedule)

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
        {!!dataSchedule && <ScheduleContent schedule={dataSchedule} />}
      </div>
    </section>
  )
}
