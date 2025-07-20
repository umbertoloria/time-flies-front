import { FC, useState } from 'react'
import { useDialogForDatePanel } from '../../context/dialog-date-panel/ContextDialogForDatePanel.tsx'
import { CalendarLoaderComponent } from '../../context/dialog-date-panel/DialogDatePanel.tsx'
import classNames from 'classnames'

const TAB_HISTORY = 'tab-history'
const TAB_TODOS = 'tab-todos'

export const PlacedCalendarManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForDatePanel()
  const [tab, setTab] = useState(TAB_TODOS)

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
          className='close-btn'
          onClick={() => {
            closeDialog()
          }}
        >
          {'Close X'}
        </button>
        <TabsList tab={tab} setTab={setTab} />
        <div className='tabs-content'>
          {tab === TAB_HISTORY && (
            <CalendarLoaderComponent calendarId={data.calendarId} />
          )}
          {tab === TAB_TODOS && <TabTodos />}
        </div>
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
