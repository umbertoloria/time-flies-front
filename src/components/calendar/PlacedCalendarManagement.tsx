import { FC } from 'react'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'
import {
  DatePanelInner,
  TabHistoryCalendarLoaderComponent,
} from '../../context/dialog-date-panel/DialogDatePanel.tsx'
import { CalendarTitle } from './CalendarGrid.tsx'
import { displayDateFromLocalDate } from './utils.ts'

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
            <TabHistoryCalendarLoaderComponent calendarId={data.calendarId} />
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
            <DatePanelInner
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

/*
const TAB_HISTORY = 'tab-history'
const TAB_TODOS = 'tab-todos'
const TabsList: FC<{
  tab: string
  setTab: (tab: string) => void
}> = ({ tab, setTab }) => {
  return (
    <div className='tabs-list'>
      <button
        className={classNames('tab-btn', {
          active: tab === TAB_TODOS,
        })}
        onClick={() => {
          setTab(TAB_TODOS)
        }}
      >
        {'Todos'}
      </button>
      <button
        className={classNames('tab-btn', {
          active: tab === TAB_HISTORY,
        })}
        onClick={() => {
          setTab(TAB_HISTORY)
        }}
      >
        {'History'}
      </button>
    </div>
  )
}

const TabTodos = () => {
  return <div className='todos'>...</div>
}
*/
