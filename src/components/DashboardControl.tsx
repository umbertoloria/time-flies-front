import { FC } from 'react'
import { ColouredLabel } from '@/components/coloured/ColouredLabel'
import { useDialogForCalendarManagement } from '@/context/dialog-calendar-management/ContextDialogForCalendarManagement'

export const DEFAULT_SEE_ALL_CALENDARS_FLAG = false
export const DashboardControl: FC<{
  seeAllCalendars: boolean
  setSeeAllCalendars: (seeAllCalendars: boolean) => void
}> = ({ seeAllCalendars, setSeeAllCalendars }) => {
  const { openDialog: openDialogForCalendarManagement } =
    useDialogForCalendarManagement()
  return (
    <div className='dashboard-control'>
      <form>
        <ColouredLabel>
          <input
            type='checkbox'
            name='checkbox-see-all-calendars'
            className='inline'
            checked={seeAllCalendars}
            onChange={event => {
              const checked = event.currentTarget.checked
              setSeeAllCalendars(checked)
            }}
          />
          {' See all calendars'}
        </ColouredLabel>
        <button
          type='button'
          className='btn-primary ml-2'
          onClick={() => {
            openDialogForCalendarManagement({
              mode: 'insert',
              loading: false, // Should be implicit.
            })
          }}
        >
          {'Create calendar'}
        </button>
      </form>
    </div>
  )
}
