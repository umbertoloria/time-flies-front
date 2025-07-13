import { FC, useEffect, useRef, useState } from 'react'
import { useDialogForDatePanel } from './ContextDialogForDatePanel.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { displayDateFromLocalDate } from '../../components/calendar/utils.ts'
import { Badge } from '../../components/calendar/Badge.tsx'
import { getSDK } from '../../remote/remote.ts'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'
import { TCalendar, TCalendarDate } from '../../remote/sdk/types'

export const DialogDatePanel: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForDatePanel()

  return (
    <>
      {isOpen && !!data && (
        <>
          {data.mode == 'calendar-date-panel' && (
            <DialogDatePanelInner
              calendarId={data.calendarId}
              date={data.date}
              closeDialog={closeDialog}
            />
          )}
          {data.mode == 'calendar-panel' && (
            <DialogCalendarPanelInner
              calendarId={data.calendarId}
              closeDialog={closeDialog}
            />
          )}
        </>
      )}
    </>
  )
}

const periodRefreshDateInMillis = 3 * 60 * 60 * 1000 // 3 minutes.
export const DialogCalendarPanelInner: FC<{
  calendarId: number
  closeDialog: () => void
}> = ({ calendarId, closeDialog }) => {
  const { readCalendar } = getSDK()
  const [data, { refetch: refreshCalendar }] = useWrapperForCreateResource(() =>
    readCalendar(calendarId).then(response =>
      typeof response === 'object' ? response : undefined
    )
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshCalendar,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [])

  const calendar = data?.data

  return (
    <GenericDialog
      onClose={closeDialog}
      labelOnClose='Indietro'
      title='Attività'
    >
      <div className='p-4 flex flex-col gap-1'>
        {data?.loading && (
          <>
            <Badge>Caricamento...</Badge>
          </>
        )}
        {!!calendar && (
          <>
            <CalendarComponent
              calendar={calendar}
              refreshCalendar={refreshCalendar}
            />
          </>
        )}
      </div>
    </GenericDialog>
  )
}
const CalendarComponent: FC<{
  calendar: TCalendar
  refreshCalendar: () => void
}> = ({ calendar, refreshCalendar }) => {
  return (
    <>
      {calendar.days.map((day, index) => (
        <div key={index}>
          <CalendarDateComponent
            data={{
              calendar: {
                id: calendar.id,
                name: calendar.name,
                usesNotes: calendar.usesNotes,
              },
              date: day,
            }}
            refreshDate={refreshCalendar}
          />
        </div>
      ))}
    </>
  )
}

export const DialogDatePanelInner: FC<{
  calendarId: number
  date: string
  closeDialog: () => void
}> = ({ calendarId, date, closeDialog }) => {
  const { readCalendarDate } = getSDK()
  const [data, { refetch: refreshDate }] = useWrapperForCreateResource(() =>
    readCalendarDate(calendarId, date)
  )
  useEffect(() => {
    const refreshDateIntervalTimer = setInterval(
      refreshDate,
      periodRefreshDateInMillis
    )
    return () => {
      clearInterval(refreshDateIntervalTimer)
    }
  }, [])

  return (
    <GenericDialog
      onClose={closeDialog}
      labelOnClose='Indietro'
      title='Attività'
    >
      <div className='p-4 flex flex-col gap-1'>
        {data?.loading && (
          <>
            <Badge>Caricamento...</Badge>
          </>
        )}
        {!!data?.data && (
          <>
            <CalendarDateComponent data={data.data} refreshDate={refreshDate} />
          </>
        )}
      </div>
    </GenericDialog>
  )
}

const CalendarDateComponent: FC<{
  data: TCalendarDate
  refreshDate: () => void
}> = ({ data, refreshDate }) => {
  return (
    <>
      <p>
        <Badge>Calendario</Badge> {data.calendar.name}
      </p>
      <p>
        <Badge>Data</Badge> {displayDateFromLocalDate(data.date.date)}
      </p>
      {data.calendar.usesNotes && (
        <>
          <CalendarDateNotesComponent
            calendarDate={data}
            refreshDate={refreshDate}
          />
        </>
      )}
    </>
  )
}

const CalendarDateNotesComponent: FC<{
  calendarDate: TCalendarDate
  refreshDate: () => void
}> = ({ calendarDate, refreshDate }) => {
  return (
    <>
      <>
        <p>
          <Badge>Note</Badge>
        </p>
        <div>
          {calendarDate.date.notes ? (
            <>
              <CalendarDayNoteSeeAndEdit
                calendarId={calendarDate.calendar.id}
                localDate={calendarDate.date.date}
                notes={{
                  text: calendarDate.date.notes,
                }}
                editable={true} // Notes are always editable.
                onUpdated={() => {
                  refreshDate()
                }}
              />
            </>
          ) : (
            <>
              <NotesAddForm
                calendarId={calendarDate.calendar.id}
                localDate={calendarDate.date.date}
                onInserted={() => {
                  refreshDate()
                }}
              />
            </>
          )}
        </div>
      </>
    </>
  )
}

const CalendarDayNoteSeeAndEdit: FC<{
  calendarId: number
  localDate: string
  notes: {
    text: string
  }
  editable: boolean
  onUpdated: () => void
}> = ({ calendarId, localDate, notes, editable, onUpdated }) => {
  const { updateCalendarDateNotes } = getSDK()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      {editing ? (
        <>
          <NotesForm
            initialValue={notes.text}
            loading={loading}
            editable={editable}
            onSubmit={_notes => {
              if (!!_notes && _notes === notes.text.trim()) {
                // Useless to save: fake the update.
                setEditing(false)
                return
              }
              setLoading(true)
              updateCalendarDateNotes(
                calendarId,
                localDate,
                _notes || undefined
              )
                .then(() => {
                  // Yay!

                  fireEventCalendarUpdated({ calendarId })
                  // fireEventStreamlineUpdated(undefined)
                  // This wasn't a Planned Event.

                  setLoading(false)
                  setEditing(false)
                  onUpdated()
                })
                .catch(err => {
                  console.error(err)
                  // TODO: Tell user all went KO
                  alert('Errore avvenuto')
                  setLoading(false)
                })
            }}
          />
        </>
      ) : (
        <>
          <p>
            {notes.text}
            {editable && (
              <button
                className='btn-primary ml-2'
                onClick={() => {
                  if (editable) {
                    setEditing(true)
                  }
                }}
              >
                {'Edit'}
              </button>
            )}
          </p>
        </>
      )}
    </div>
  )
}

const NotesAddForm: FC<{
  calendarId: number
  localDate: string
  onInserted: () => void
}> = ({ calendarId, localDate, onInserted }) => {
  const { updateCalendarDateNotes } = getSDK()
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <>
      {adding ? (
        <>
          <NotesForm
            initialValue=''
            loading={loading}
            editable
            onSubmit={_notes => {
              setLoading(true)
              updateCalendarDateNotes(
                calendarId,
                localDate,
                _notes || undefined
              )
                .then(() => {
                  // Yay!

                  fireEventCalendarUpdated({ calendarId })
                  // fireEventStreamlineUpdated(undefined)
                  // This wasn't a Planned Event.

                  setLoading(false)
                  setAdding(false)
                  onInserted()
                })
                .catch(err => {
                  console.error(err)
                  // TODO: Tell user all went KO
                  alert('Errore avvenuto')
                  setLoading(false)
                })
            }}
          />
        </>
      ) : (
        <>
          <button
            className='btn-primary'
            onClick={() => {
              setAdding(true)
            }}
          >
            {'Add'}
          </button>
        </>
      )}
    </>
  )
}

const NotesForm: FC<{
  initialValue: string
  loading: boolean
  editable: boolean
  onSubmit: (value: string | null) => void
}> = ({ initialValue, loading, editable, onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <input
          type='text'
          name='notes-text'
          ref={inputRef}
          className='block w-full px-2 py-1  border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900 bg-white text-gray-700'
          defaultValue={initialValue}
          disabled={loading}
        />
        <button
          className='btn-primary mt-1'
          disabled={loading}
          onClick={() => {
            if (editable && !loading) {
              const inputElement = inputRef.current
              if (!inputElement) {
                return
              }
              const inputValue = inputElement.value
              if (inputValue === '') {
                // Remove notes
                onSubmit(null)
              } else {
                // TODO: Duplicated code (*sdcn)
                const _notes = inputValue.trim()
                if (_notes.length < 2 || _notes.length > 300) {
                  alert('Nota non valida: minimo 2 massimo 300 caratteri')
                  return
                }
                onSubmit(_notes)
              }
            }
          }}
        >
          {'Save'}
        </button>
      </form>
    </>
  )
}
