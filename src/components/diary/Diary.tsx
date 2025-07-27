import { FC, useRef, useState } from 'react'
import { TCalendarDate } from '../../remote/sdk/types'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { getSDK } from '../../remote/remote.ts'
import { fireEventCalendarUpdated } from '../calendar/event-calendar-updated.ts'

export const DiaryEntriesListAccordion: FC<{
  title?: string
  initialOpen?: boolean
  dates: TCalendarDate[]
  refreshDate: () => void
}> = ({ title, initialOpen, dates, refreshDate }) => {
  const [isOpen, setOpen] = useState(
    initialOpen === undefined ? true : initialOpen
  )
  return (
    <div>
      {!!title && (
        <>
          <a
            className='inline font-bold bg-gray-300 p-0.5 rounded cursor-pointer'
            onClick={() => {
              setOpen(!isOpen)
            }}
          >
            {title}
          </a>
        </>
      )}
      {isOpen && (
        <>
          {dates.map((date, index) => (
            <div key={index}>
              <DiaryEntry
                calendarId={date.calendar.id}
                calendarUsesNotes={!!date.calendar.usesNotes}
                date={date.date.date}
                dateNotes={date.date.notes}
                refreshDate={refreshDate}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export const DiaryEntry: FC<{
  calendarId: number
  calendarUsesNotes: boolean
  date: string
  dateNotes?: string
  refreshDate: () => void
}> = ({ date, calendarId, calendarUsesNotes, dateNotes, refreshDate }) => {
  return (
    <>
      <i className='underline'>{displayDateFromLocalDate(date)}</i>
      {calendarUsesNotes && (
        <>
          <CalendarDateNotesComponent
            calendarId={calendarId}
            date={date}
            dateNotes={dateNotes}
            refreshDate={refreshDate}
          />
        </>
      )}
    </>
  )
}

const CalendarDateNotesComponent: FC<{
  calendarId: number
  date: string
  dateNotes?: string
  refreshDate: () => void
}> = ({ calendarId, date, dateNotes, refreshDate }) => {
  // Assuming Calendar Uses Notes.
  return (
    <>
      {dateNotes ? (
        <>
          <CalendarDayNoteSeeAndEdit
            calendarId={calendarId}
            localDate={date}
            notes={{
              text: dateNotes,
            }}
            editable={true} // Notes are always editable.
            onUpdated={refreshDate}
          />
        </>
      ) : (
        <>
          <NotesAddForm
            calendarId={calendarId}
            localDate={date}
            onInserted={refreshDate}
          />
        </>
      )}
    </>
  )
}

const { updateCalendarDateNotes } = getSDK()
const CalendarDayNoteSeeAndEdit: FC<{
  calendarId: number
  localDate: string
  notes: {
    text: string
  }
  editable: boolean
  onUpdated: () => void
}> = ({ calendarId, localDate, notes, editable, onUpdated }) => {
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
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <>
      {adding ? (
        <div>
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
        </div>
      ) : (
        <>
          <button
            className='btn-primary ml-2'
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
