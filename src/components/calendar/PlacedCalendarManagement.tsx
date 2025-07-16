import { FC } from 'react'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'
import { CalendarLoaderComponent } from '../../context/dialog-date-panel/DialogDatePanel.tsx'

export const PlacedCalendarManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForDatePanel()

  if (!isOpen || data?.mode !== 'calendar-panel') {
    return (
      <>
        <div className='placed-calendar-management'>{/* Empty */}</div>
      </>
    )
  }

  return (
    <>
      <div className='placed-calendar-management'>
        <button
          className='btn-primary mb-2'
          onClick={() => {
            closeDialog()
          }}
        >
          {'Close X'}
        </button>
        <CalendarLoaderComponent calendarId={data.calendarId} />
      </div>
    </>
  )
}
