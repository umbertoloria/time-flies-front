import { FC } from 'react'
import { useDialogForDatePanel } from '../../context/date-panel/ContextDialogForDatePanel.tsx'
import { DatePanelInnerCLI } from '../../context/date-panel/DatePanelCLI.tsx'
import { CalendarTitle } from './CalendarGrid.tsx'
import { displayDateFromLocalDate } from './utils.ts'
import { CLICalendarHistory } from '../../context/date-panel/CLICalendarHistory.tsx'
import { useDialogForCalendarManagement } from '../../context/dialog-calendar-management/ContextDialogForCalendarManagement.tsx'

export const PlacedCalendarManagement: FC = () => {
  const { openDialog: openDialogForCalendarManagement } =
    useDialogForCalendarManagement()
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
            <CalendarTitle textColor='#fff' label='Calendario'>
              <div>
                <button
                  className='close-btn'
                  onClick={() => {
                    openDialogForCalendarManagement({
                      mode: 'update',
                      calendarId: data.calendarId,
                      loading: false, // Should be implicit.
                    })
                  }}
                >
                  {'Edit'}
                </button>
                <button
                  className='close-btn ml-2'
                  onClick={closeDialogForDatePanel}
                >
                  {'Close'}
                </button>
              </div>
            </CalendarTitle>
            <CLICalendarHistory calendarId={data.calendarId} />
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
