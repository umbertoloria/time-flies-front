import { FC, useRef, useState } from 'react'
import {
  TCalendar,
  TCalendarRcd,
  TDay,
  TNewDoneTask,
} from '../../remote/sdk/types'
import { displayDateFromLocalDate } from '../calendar/utils.ts'
import { getSDK } from '../../remote/remote.ts'
import { fireEventCalendarUpdated } from '../calendar/event-calendar-updated.ts'
import { fireEventStreamlineUpdated } from '../streamline/event-streamline-updated.ts'
import { ColouredQuad } from '../coloured/ColouredQuad.tsx'

export const DiaryEntriesListAccordion: FC<{
  title?: string
  initialOpen?: boolean
  calendar: TCalendar
  days: TDay[]
  refreshDate: () => void
}> = ({ title, initialOpen, calendar, days, refreshDate }) => {
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
          {days.map((day, index) => (
            <div key={index}>
              <DiaryEntryDate
                calendar={calendar}
                date={day.date}
                doneTasks={[
                  {
                    id: 0, // FIXME: Never used but dangerous!
                    notes: day.notes,
                  },
                ]}
                todos={[]}
                refreshDate={refreshDate}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export const DiaryEntryDate: FC<{
  calendar: TCalendarRcd
  date: string
  doneTasks: TNewDoneTask[]
  todos: TNewDoneTask[]
  refreshDate: () => void
}> = ({ date, calendar, doneTasks, todos, refreshDate }) => {
  // FIXME: Improve UX here
  return (
    <>
      <i className='underline'>{displayDateFromLocalDate(date)}</i>
      {doneTasks.map((doneTask, index) => (
        <div key={index}>
          <ColouredQuad color={calendar.color} />
          {!!calendar.usesNotes && (
            <>
              <CalendarDateNotesComponent
                mode={{
                  type: 'doneTask',
                  calendarId: calendar.id,
                  date,
                }}
                dateNotes={doneTask.notes}
                refreshDate={refreshDate}
              />
            </>
          )}
        </div>
      ))}
      {todos.map((todo, index) => (
        <div key={index}>
          <ColouredQuad color={calendar.plannedColor} />
          {!!calendar.usesNotes && (
            <>
              <CalendarDateNotesComponent
                mode={{
                  type: 'todo',
                  calendarId: calendar.id,
                  eventId: todo.id,
                }}
                dateNotes={todo.notes}
                refreshDate={refreshDate}
              />
            </>
          )}
          {/* FIXME: Insert Done/Skip buttons here */}
        </div>
      ))}
    </>
  )
}

const CalendarDateNotesComponent: FC<{
  mode:
    | {
        type: 'doneTask'
        calendarId: number
        date: string
      }
    | {
        type: 'todo'
        calendarId: number
        eventId: number
      }
  dateNotes?: string
  refreshDate: () => void
}> = ({ mode, dateNotes, refreshDate }) => {
  // Assuming Calendar Uses Notes.
  return (
    <>
      {dateNotes ? (
        <>
          <CalendarDayNoteSeeAndEdit
            mode={mode}
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
            //
            mode={mode}
            onInserted={refreshDate}
          />
        </>
      )}
    </>
  )
}

const { updateCalendarDateNotes, updatePlannedEvent } = getSDK()
const CalendarDayNoteSeeAndEdit: FC<{
  mode:
    | {
        type: 'doneTask'
        calendarId: number
        date: string
      }
    | {
        type: 'todo'
        calendarId: number
        eventId: number
      }
  notes: {
    text: string
  }
  editable: boolean
  onUpdated: () => void
}> = ({ mode, notes, editable, onUpdated }) => {
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
              if (mode.type === 'doneTask') {
                updateCalendarDateNotes(
                  mode.calendarId,
                  mode.date,
                  _notes || undefined
                )
                  .then(() => {
                    // Yay!

                    fireEventCalendarUpdated({ calendarId: mode.calendarId })
                    // fireEventStreamlineUpdated(undefined)

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
              } else if (mode.type === 'todo') {
                updatePlannedEvent(mode.calendarId, mode.eventId, {
                  notes: _notes || undefined,
                })
                  .then(() => {
                    // Yay!

                    // fireEventCalendarUpdated({ calendarId })
                    fireEventStreamlineUpdated(undefined)

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
              }
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
  mode:
    | {
        type: 'doneTask'
        calendarId: number
        date: string
      }
    | {
        type: 'todo'
        calendarId: number
        eventId: number
      }
  onInserted: () => void
}> = ({ mode, onInserted }) => {
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
              if (mode.type === 'doneTask') {
                updateCalendarDateNotes(
                  mode.calendarId,
                  mode.date,
                  _notes || undefined
                )
                  .then(() => {
                    // Yay!

                    fireEventCalendarUpdated({ calendarId: mode.calendarId })
                    // fireEventStreamlineUpdated(undefined)

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
              } else if (mode.type === 'todo') {
                updatePlannedEvent(mode.calendarId, mode.eventId, {
                  notes: _notes || undefined,
                })
                  .then(() => {
                    // Yay!

                    // fireEventCalendarUpdated({ calendarId })
                    fireEventStreamlineUpdated(undefined)

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
              }
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
          className='block w-full px-2 py-1 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900 bg-white text-gray-700'
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
