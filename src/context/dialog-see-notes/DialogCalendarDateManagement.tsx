import { FC, useEffect, useRef, useState } from 'react'
import { useDialogForCalendarDateManagement } from './ContextDialogForCalendarDateManagement.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { displayDateFromLocalDate } from '../../components/calendar/utils.ts'
import { Badge } from '../../components/calendar/Badge.tsx'
import { getSDK } from '../../remote/remote.ts'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'
import { useWrapperForCreateResource } from '../../lib/remote-resources.ts'

export const DialogCalendarDateManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForCalendarDateManagement()

  return (
    <>
      {isOpen && !!data && (
        <DialogCalendarDateManagementInner
          calendarId={data.calendarId}
          date={data.date}
          closeDialog={closeDialog}
        />
      )}
    </>
  )
}

const periodRefreshDateInMillis = 3 * 60 * 60 * 1000 // 3 minutes.
export const DialogCalendarDateManagementInner: FC<{
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

  const editable = true // TODO: Understand when a Calendar Date can be updated

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
            <p>
              <Badge>Calendario</Badge> {data.data.calendar.name}
            </p>
            <p>
              <Badge>Data</Badge>{' '}
              {displayDateFromLocalDate(data.data.date.date)}
            </p>
            <p>
              <Badge>Note</Badge>
            </p>
            <div>
              {data.data.date.notes ? (
                <>
                  <CalendarDayNote
                    calendarId={data.data.calendar.id}
                    localDate={data.data.date.date}
                    notes={{
                      text: data.data.date.notes,
                    }}
                    editable={editable}
                    onUpdated={() => {
                      refreshDate()
                    }}
                  />
                </>
              ) : (
                <>
                  <NotesAddForm
                    calendarId={data.data.calendar.id}
                    localDate={data.data.date.date}
                    editable={editable}
                    onInserted={() => {
                      refreshDate()
                    }}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </GenericDialog>
  )
}

const CalendarDayNote: FC<{
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
  editable: boolean
  onInserted: () => void
}> = ({ calendarId, localDate, editable, onInserted }) => {
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
            editable={editable}
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
              if (editable) {
                setAdding(true)
              }
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
