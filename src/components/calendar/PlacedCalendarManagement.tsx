import { FC } from 'react'
import { CalendarTitle } from '@/components/calendar/CalendarGrid'
import { displayDateFromLocalDate } from '@/components/calendar/utils'
import { Badge } from '@/components/calendar/Badge'
import { useDialogForDatePanel } from '@/context/date-panel/ContextDialogForDatePanel'
import { DatePanelInnerCLI } from '@/context/date-panel/DatePanelCLI'
import { CLICalendarHistoryStateless } from '@/context/date-panel/CLICalendarHistory'
import { useDialogForCalendarManagement } from '@/context/dialog-calendar-management/ContextDialogForCalendarManagement'
import { useReadCalendar } from '@/remote/useCalendarQueries'

export const PlacedCalendarManagement: FC = () => {
  const {
    isOpen,
    data,
    closeDialog: closeDialogForDatePanel,
  } = useDialogForDatePanel()
  return (
    <>
      <div className='placed-calendar-management'>
        {isOpen && data?.mode === 'calendar-panel' && (
          <>
            <PlacedCalendarManagementModeCalendar
              calendarId={data.calendarId}
              onClose={closeDialogForDatePanel}
            />
          </>
        )}
        {isOpen && data?.mode === 'calendar-date-panel' && (
          <>
            <CalendarTitle
              textColor='#fff'
              label={displayDateFromLocalDate(data.date)}
            >
              <button
                className='close-btn btn-primary'
                onClick={closeDialogForDatePanel}
              >
                {'Close'}
              </button>
            </CalendarTitle>
            <DatePanelInnerCLI
              //
              calendarId={data.calendarId}
              date={data.date}
            />
          </>
        )}
      </div>
    </>
  )
}

const PlacedCalendarManagementModeCalendar: FC<{
  calendarId: number
  onClose: () => void
}> = ({ calendarId, onClose }) => {
  const { data, isPending, error, refetch } = useReadCalendar(calendarId)

  const { openDialog: openDialogForCalendarManagement } =
    useDialogForCalendarManagement()

  return (
    <>
      {isPending ? (
        <Badge>Caricamento...</Badge>
      ) : error ? (
        <Badge>Errore!</Badge>
      ) : (
        <>
          <CalendarTitle textColor='#fff' label='Calendario'>
            <div>
              <button
                className='close-btn btn-primary mr-2'
                onClick={() => {
                  if (!isPending && !!data) {
                    openDialogForCalendarManagement({
                      mode: 'update',
                      loading: false, // Should be implicit.
                      calendar: data,
                    })
                  }
                }}
              >
                {'Edit'}
              </button>
              <button className='close-btn btn-primary' onClick={onClose}>
                {'Close'}
              </button>
            </div>
          </CalendarTitle>
          <CLICalendarHistoryStateless
            calendar={data}
            refreshCalendar={refetch}
          />
        </>
      )}
    </>
  )
}
