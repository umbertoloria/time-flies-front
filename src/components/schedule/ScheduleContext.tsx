'use client'

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'
import { getTodayLocalDate } from '@/lib/utils'
import { TExerciseGroup, TSchedule } from '@/remote/sdk/types'

const ScheduleContext = createContext<{
  localDate: string
  setLocalDate: (localDate: string) => void
  schedule?: TSchedule
  setSchedule: (schedule: TSchedule) => void
  exerciseGroup: TExerciseGroup[]
  setExerciseGroup: (exerciseGroup: TExerciseGroup[]) => void
}>({
  localDate: '',
  setLocalDate() {},
  schedule: undefined,
  setSchedule() {},
  exerciseGroup: [],
  setExerciseGroup() {},
})

export const ScheduleProvider: FC<PropsWithChildren> = props => {
  const [localDate, setLocalDate] = useState(getTodayLocalDate)
  const [schedule, setSchedule] = useState<undefined | TSchedule>()
  const [exerciseGroup, setExerciseGroup] = useState<TExerciseGroup[]>([])

  return (
    <ScheduleContext.Provider
      value={{
        localDate,
        setLocalDate,
        schedule,
        setSchedule,
        exerciseGroup,
        setExerciseGroup,
      }}
    >
      {props.children}
    </ScheduleContext.Provider>
  )
}

export const useScheduleContext = () => {
  return useContext(ScheduleContext)
}
