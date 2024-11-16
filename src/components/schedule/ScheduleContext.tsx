import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'
import { TExerciseGroup, TSchedule } from '../../remote/sdk/types'

const ScheduleContext = createContext<{
  schedule?: TSchedule
  setSchedule: (schedule: TSchedule) => void
  exerciseGroup: TExerciseGroup[]
  setExerciseGroup: (exerciseGroup: TExerciseGroup[]) => void
}>({
  schedule: undefined,
  setSchedule() {},
  exerciseGroup: [],
  setExerciseGroup() {},
})

export const ScheduleProvider: FC<PropsWithChildren> = props => {
  const [schedule, setSchedule] = useState<undefined | TSchedule>()
  const [exerciseGroup, setExerciseGroup] = useState<TExerciseGroup[]>([])

  return (
    <ScheduleContext.Provider
      value={{
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
