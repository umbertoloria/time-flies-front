import { FC, PropsWithChildren, useEffect } from 'react'
import { getITMonthFromLocalDate } from '../../lib/utils'
import { DayStatus, DayStatusProps } from './DayStatus'
import { CustomEventFnType } from '../../events/event-builder.ts'
import {
  CustomEventTypeCalendarUpdated,
  subscribeToCalendarUpdates,
  unsubscribeToCalendarUpdates,
} from './event-calendar-updated.ts'
import { getFirstAndLastLocalDatesFromDayStatusRows } from './utils'
import { LogicCalendar } from './logic-calendar.ts'
import { createDayStatusPropsListFromLogicCalendar } from '../timeline/timeline-utils.ts'
import classNames from 'classnames'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'

export type DayStatusRow = {
  dayStatuses: DayStatusProps[]
}

function makeDayStatusRowsFromLogicCalendar(
  logicCalendar: LogicCalendar,
  fromDateMonday: Date,
  weeksToShow: number
): DayStatusRow[] {
  // Requirements:
  // 1. Logic Days must be sorted in Date
  // 2. "fromDateMonday" must be a Monday

  const fillingCellsCount = 7 as const // 7 days per week.
  const dayStatusRows: DayStatusRow[] = []
  const dayStatusPropsList = createDayStatusPropsListFromLogicCalendar(
    logicCalendar,
    fromDateMonday,
    weeksToShow * 7
  )
  for (const dayStatusProps of dayStatusPropsList) {
    if (dayStatusRows.length === 0) {
      dayStatusRows.push({
        dayStatuses: [],
      })
    }
    let cells = dayStatusRows[dayStatusRows.length - 1].dayStatuses
    if (cells.length === fillingCellsCount) {
      dayStatusRows.push({
        dayStatuses: [],
      })
      cells = dayStatusRows[dayStatusRows.length - 1].dayStatuses
    }
    cells.push(dayStatusProps)
  }

  return dayStatusRows
}

export const LogicCalendarGridListening: FC<{
  logicCalendar: LogicCalendar
  fromDateMonday: Date // Use "moveDateToClosestNonFutureMonday" for that.
  numWeeks: number
  pleaseUpdateCalendar: () => void
  goInThePast: () => void
  goInTheFuture: () => void
}> = props => {
  const { openDialog: openDialogForDatePanel } = useDialogForDatePanel()
  return (
    <CalendarGridStatelessListening
      dayStatusRows={makeDayStatusRowsFromLogicCalendar(
        props.logicCalendar,
        props.fromDateMonday,
        props.numWeeks
      )}
      calendarData={{
        idForUpdate: props.logicCalendar.apiCalendar?.id,
        color: props.logicCalendar.color,
        name: props.logicCalendar.name,
        onClick: props.logicCalendar.onClickOpenDialogForCalendarOverview
          ? () => {
              if (props.logicCalendar.apiCalendar) {
                openDialogForDatePanel({
                  mode: 'calendar-panel',
                  calendarId: props.logicCalendar.apiCalendar.id,
                })
              }
            }
          : undefined,
      }}
      showHeadRowForWeekDays
      pleaseUpdateCalendar={props.pleaseUpdateCalendar}
      goInThePast={props.goInThePast}
      goInTheFuture={props.goInTheFuture}
    />
  )
}

export const CalendarGridStatelessListening: FC<{
  dayStatusRows: DayStatusRow[]
  calendarData?: {
    idForUpdate?: number
    color: string
    name: string
    onClick?: () => void
  }
  showHeadRowForWeekDays?: boolean
  pleaseUpdateCalendar: () => void
  goInThePast?: () => void
  goInTheFuture?: () => void
}> = props => {
  const { firstLocalDate, lastLocalDate } =
    getFirstAndLastLocalDatesFromDayStatusRows(props.dayStatusRows)
  const firstMonthLang = getITMonthFromLocalDate(firstLocalDate)
  const lastMonthLang = getITMonthFromLocalDate(lastLocalDate)

  useEffect(() => {
    const listener: CustomEventFnType<
      CustomEventTypeCalendarUpdated
    > = event => {
      const { calendarId } = event.detail
      if (
        props.pleaseUpdateCalendar &&
        props.calendarData?.idForUpdate &&
        calendarId === props.calendarData.idForUpdate
      ) {
        props.pleaseUpdateCalendar()
      }
    }
    subscribeToCalendarUpdates(listener)
    return () => {
      unsubscribeToCalendarUpdates(listener)
    }
  }, [])

  return (
    <div>
      {!!props.calendarData && !!props.goInThePast && !!props.goInTheFuture && (
        <>
          <CalendarTitle
            textColor={props.calendarData.color}
            label={props.calendarData.name}
            onClick={props.calendarData.onClick}
          >
            <CalendarArrowControl
              firstMonthLang={firstMonthLang}
              lastMonthLang={lastMonthLang}
              goInThePast={props.goInThePast}
              goInTheFuture={props.goInTheFuture}
            />
          </CalendarTitle>
        </>
      )}
      <CalendarGridStatelessTable
        dayStatusRows={props.dayStatusRows}
        showHeadRowForWeekDays={!!props.showHeadRowForWeekDays}
      />
    </div>
  )
}

export const CalendarTitle: FC<
  PropsWithChildren<{
    textColor?: string
    label: string
    onClick?: () => void
  }>
> = props => (
  <div className='bg-gray-500 rounded mb-2 mx-auto px-2.5 py-1.5 max-w-96 flex flex-wrap items-center justify-between'>
    <a
      className={classNames(
        'bg-gray-600 px-1 rounded text-lg font-semibold text-gray-700',
        {
          'cursor-pointer': !!props.onClick,
        }
      )}
      style={{
        color: props.textColor || undefined,
      }}
      onClick={() => {
        if (props.onClick) {
          props.onClick()
        }
      }}
    >
      {props.label}
    </a>
    {props.children}
  </div>
)

export const CalendarArrowControl: FC<{
  firstMonthLang: string
  lastMonthLang: string
  goInThePast: () => void
  goInTheFuture: () => void
}> = ({ firstMonthLang, lastMonthLang, goInThePast, goInTheFuture }) => {
  return (
    <div className='flex flex-wrap gap-3 bg-gray-400 p-1 rounded-full w-fit'>
      <CalendarTimeTravelButton label='<' onClick={goInThePast} />
      <div className='text-center min-w-20'>
        {firstMonthLang}
        {'-'}
        {lastMonthLang}
      </div>
      <CalendarTimeTravelButton label='>' onClick={goInTheFuture} />
    </div>
  )
}
const CalendarTimeTravelButton: FC<{
  label: string
  onClick: () => void
}> = props => (
  <button
    className='rounded-full bg-white w-6 h-6 text-center font-bold'
    onClick={props.onClick}
  >
    {props.label}
  </button>
)

const CalendarGridStatelessTable: FC<{
  dayStatusRows: DayStatusRow[]
  showHeadRowForWeekDays: boolean
}> = props => {
  return (
    <table className='m-auto text-gray-700'>
      <tbody>
        {props.showHeadRowForWeekDays && <CalendarGridHeadRowForWeekDays />}
        {props.dayStatusRows.map((dayStatusRow, index) => (
          <tr key={index}>
            {dayStatusRow.dayStatuses.map((cell, index) => (
              <td key={index} className='m-0 p-0'>
                <DayStatus {...cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const weekDays = [
  {
    name: 'monday',
    display: 'Lun',
  },
  {
    name: 'tuesday',
    display: 'Mar',
  },
  {
    name: 'wednesday',
    display: 'Mer',
  },
  {
    name: 'thursday',
    display: 'Gio',
  },
  {
    name: 'friday',
    display: 'Ven',
  },
  {
    name: 'saturday',
    display: 'Sab',
  },
  {
    name: 'sunday',
    display: 'Dom',
  },
]
const CalendarGridHeadRowForWeekDays: FC = () => (
  <tr>
    {weekDays.map((day, index) => (
      <th className='m-0 p-0' key={index}>
        <span>{day.display}</span>
      </th>
    ))}
  </tr>
)
