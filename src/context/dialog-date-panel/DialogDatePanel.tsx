import { FC, useEffect } from 'react'
import { useDialogForDatePanel } from './ContextDialogForDatePanel.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { Badge } from '../../components/calendar/Badge.tsx'
import { getSDK } from '../../remote/remote.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendar } from '../../remote/sdk/types'
import { DiaryEntriesList, DiaryEntry } from '../../components/diary/Diary.tsx'
import {
  filterUnique,
  getDateFromLocalDate,
  getTodayYear,
} from '../../lib/utils.ts'

export const DialogDatePanel: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForDatePanel()

  return (
    <>
      {isOpen && !!data && (
        <>
          {data.mode == 'calendar-date-panel' && (
            <DialogDatePanelInner
              calendarId={data.calendarId}
              date={data.date}
              closeDialog={closeDialog}
            />
          )}
          {data.mode == 'calendar-panel' && (
            <GenericDialog
              onClose={closeDialog}
              labelOnClose='Indietro'
              title='Attività'
            >
              <div className='p-4 flex flex-col gap-1'>
                <CalendarLoaderComponent calendarId={data.calendarId} />
              </div>
            </GenericDialog>
          )}
        </>
      )}
    </>
  )
}

const periodRefreshDateInMillis = 3 * 60 * 60 * 1000 // 3 minutes.
const { readCalendar, readCalendarDate } = getSDK()
const CalendarLoaderComponent: FC<{
  calendarId: number
}> = ({ calendarId }) => {
  const [data, { refetch: refreshCalendar }] = useWrapperForCreateResource(() =>
    readCalendar(calendarId).then(response =>
      typeof response === 'object' ? response : undefined
    )
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshCalendar,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [])
  const calendar = data?.data

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Caricamento...</Badge>
        </>
      )}
      {!!calendar && (
        <>
          <CalendarComponent
            calendar={calendar}
            refreshCalendar={refreshCalendar}
          />
        </>
      )}
    </>
  )
}
const CalendarComponent: FC<{
  calendar: TCalendar
  refreshCalendar: () => void
}> = ({ calendar, refreshCalendar }) => {
  const allYears = calendar.days
    .map(day => getDateFromLocalDate(day.date).getFullYear())
    .filter(filterUnique)
  const todayYear = getTodayYear()

  if (allYears.length === 1) {
    return (
      <>
        <DiaryEntriesList
          initialOpen
          dates={calendar.days.map(date => ({
            calendar: {
              id: calendar.id,
              name: calendar.name,
              usesNotes: calendar.usesNotes,
            },
            date,
          }))}
          refreshDate={refreshCalendar}
        />
      </>
    )
  } else {
    const currentYearDates = calendar.days.filter(
      date => getDateFromLocalDate(date.date).getFullYear() === todayYear
    )
    const allPastYears = allYears.filter(year => year !== todayYear)
    return (
      <>
        {!!currentYearDates.length && (
          <DiaryEntriesList
            title={todayYear.toString()}
            initialOpen
            dates={currentYearDates.map(date => ({
              calendar: {
                id: calendar.id,
                name: calendar.name,
                usesNotes: calendar.usesNotes,
              },
              date,
            }))}
            refreshDate={refreshCalendar}
          />
        )}
        {allPastYears.map((year, index) => (
          <div key={index}>
            <DiaryEntriesList
              title={year.toString()}
              initialOpen={false}
              dates={calendar.days
                .filter(
                  date => getDateFromLocalDate(date.date).getFullYear() === year
                )
                .map(date => ({
                  calendar: {
                    id: calendar.id,
                    name: calendar.name,
                    usesNotes: calendar.usesNotes,
                  },
                  date,
                }))}
              refreshDate={refreshCalendar}
            />
          </div>
        ))}
      </>
    )
  }
}

export const DialogDatePanelInner: FC<{
  calendarId: number
  date: string
  closeDialog: () => void
}> = ({ calendarId, date, closeDialog }) => {
  const [data, { refetch: refreshDate }] = useWrapperForCreateResource(() =>
    readCalendarDate(calendarId, date)
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshDate,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [])

  return (
    <GenericDialog
      onClose={closeDialog}
      labelOnClose='Indietro'
      title='Attività'
    >
      <div className='p-4 flex flex-col gap-1'>
        {data?.loading && (
          <>
            <Badge>Caricamento...</Badge>
          </>
        )}
        {!!data?.data && (
          <>
            <DiaryEntry
              //
              date={data.data}
              refreshDate={refreshDate}
            />
          </>
        )}
      </div>
    </GenericDialog>
  )
}
