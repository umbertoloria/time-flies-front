import { FC } from 'react'
import { useDialogForDatePanel } from '../../context/date-panel/ContextDialogForDatePanel.tsx'
import { DatePanelInnerCLI } from '../../context/date-panel/DatePanelCLI.tsx'
import { CalendarTitle } from './CalendarGrid.tsx'
import { displayDateFromLocalDate } from './utils.ts'
import { CLICalendarHistory } from '../../context/date-panel/CLICalendarHistory.tsx'

export const PlacedCalendarManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForDatePanel()
  return (
    <>
      <div className='placed-calendar-management'>
        {isOpen && data?.mode === 'calendar-panel' && (
          <>
            <CalendarTitle textColor='#fff' label='Calendario'>
              <button className='close-btn' onClick={closeDialog}>
                {'Close X'}
              </button>
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
              <button className='close-btn' onClick={closeDialog}>
                {'Close X'}
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
