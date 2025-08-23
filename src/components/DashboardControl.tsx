import { FC } from 'react'
import { ColouredLabel } from './coloured/ColouredLabel.tsx'

export const DEFAULT_SEE_ALL_CALENDARS_FLAG = false
export const DashboardControl: FC<{
  seeAllCalendars: boolean
  setSeeAllCalendars: (seeAllCalendars: boolean) => void
}> = ({ seeAllCalendars, setSeeAllCalendars }) => {
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
      </form>
    </div>
  )
}
