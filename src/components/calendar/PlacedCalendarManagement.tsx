import { FC, useState } from 'react'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'
import {
  DatePanelInner,
  TabHistoryCalendarLoaderComponent,
} from '../../context/dialog-date-panel/DialogDatePanel.tsx'
import classNames from 'classnames'
import { CalendarTitle } from './CalendarGrid.tsx'
import { displayDateFromLocalDate } from './utils.ts'

const TAB_HISTORY = 'tab-history'
const TAB_TODOS = 'tab-todos'

export const PlacedCalendarManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForDatePanel()
  const [tab, setTab] = useState(TAB_TODOS)
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
            <TabsList tab={tab} setTab={setTab} />
            <div className='tabs-content'>
              {tab === TAB_HISTORY && (
                <TabHistoryCalendarLoaderComponent
                  calendarId={data.calendarId}
                />
              )}
              {tab === TAB_TODOS && <TabTodos />}
            </div>
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
