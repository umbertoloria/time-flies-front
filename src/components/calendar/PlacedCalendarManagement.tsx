import { FC } from 'react'
import { useDialogForDatePanel } from '../../context/date-panel/ContextDialogForDatePanel.tsx'
import { DatePanelInnerCLI } from '../../context/date-panel/DatePanelCLI.tsx'
import { CalendarTitle } from './CalendarGrid.tsx'
import { displayDateFromLocalDate } from './utils.ts'
import {
  CLICalendarHistoryStateless,
  useCalendarDownloader,
} from '../../context/date-panel/CLICalendarHistory.tsx'
import { useDialogForCalendarManagement } from '../../context/dialog-calendar-management/ContextDialogForCalendarManagement.tsx'
import { Badge } from './Badge.tsx'

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
              <button className='close-btn' onClick={closeDialogForDatePanel}>
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
  const { data, refreshCalendar } = useCalendarDownloader(calendarId)
  const { openDialog: openDialogForCalendarManagement } =
    useDialogForCalendarManagement()

  return (
    <>
      {data?.loading && (
        <>
          <Badge>Loading...</Badge>
        </>
      )}
      {!data?.loading && !!data?.data && (
        <>
          <CalendarTitle textColor='#fff' label='Calendario'>
            <div>
              <button
                className='close-btn mr-2'
                onClick={() => {
                  if (!data?.loading && data?.data) {
                    openDialogForCalendarManagement({
                      mode: 'update',
                      loading: false, // Should be implicit.
                      calendar: data.data,
                    })
                  }
                }}
              >
                {'Edit'}
              </button>
              <button className='close-btn' onClick={onClose}>
                {'Close'}
              </button>
            </div>
          </CalendarTitle>
          <CLICalendarHistoryStateless
            calendar={data.data}
            refreshCalendar={refreshCalendar}
          />
        </>
      )}
    </>
  )
}
