import { FC, useRef, useState } from 'react'
import {
  ContextPartDataNotes,
  useDialogForCalendarDateManagement,
} from './ContextDialogForCalendarDateManagement.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { displayDateFromLocalDate } from '../../components/calendar/utils.ts'
import { Badge } from '../../components/calendar/Badge.tsx'
import { getSDK } from '../../remote/remote.ts'
import { fireEventCalendarUpdated } from '../../components/calendar/event-calendar-updated.ts'

export const DialogCalendarDateManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForCalendarDateManagement()

  return (
    <>
      {isOpen && (
        <GenericDialog
          onClose={closeDialog}
          labelOnClose='Indietro'
          title='Attività'
        >
          {!!data && (
            <>
              <div className='p-4 flex flex-col gap-1'>
                <p>
                  <Badge>Data</Badge> {displayDateFromLocalDate(data.date)}
                </p>
                {!!data.notes && (
                  <>
                    <p>
                      <Badge>Note</Badge>
                    </p>
                    <div>
                      <CalendarDayNote
                        calendarId={data.calendarId}
                        localDate={data.date}
                        notes={data.notes}
                        editable={true}
                        onUpdated={() => {
                          closeDialog()
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </GenericDialog>
      )}
    </>
  )
}

const CalendarDayNote: FC<{
  calendarId: number
  localDate: string
  notes: ContextPartDataNotes
  editable: boolean
  onUpdated: () => void
}> = ({ calendarId, localDate, notes, editable, onUpdated }) => {
  const { updateCalendarDateNotes } = getSDK()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      {editing ? (
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
              defaultValue={notes.text}
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
                  // TODO: Duplicated code (*sdcn)
                  const _notes = inputValue.trim()
                  if (_notes.length < 2 || _notes.length > 300) {
                    alert('Nota non valida: minimo 2 massimo 300 caratteri')
                    return
                  }
                  if (_notes === notes.text.trim()) {
                    // Useless to save: fake the update.
                    setEditing(false)
                    return
                  }
                  setLoading(true)
                  updateCalendarDateNotes(calendarId, localDate, _notes)
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
                }
              }}
            >
              {'Save'}
            </button>
          </form>
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
