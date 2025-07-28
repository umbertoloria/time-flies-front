import { FC, useEffect, useState } from 'react'
import { useDialogForCheckPlannedEvent } from './ContextDialogForCheckPlannedEvents.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { NotesFieldEditor } from '../dialog-insert-new-goal/DialogForInsertNewGoal.tsx'
import { getTodayLocalDate } from '../../lib/utils.ts'

const INITIAL_ENABLE_NOTE = false
const INITIAL_INPUT_VALUE = ''
export const DialogCheckPlannedEvent: FC = () => {
  // TODO: Unify this with "DialogForInsertNewGoal"?

  const { isOpen, data, closeDialog, confirmProgressDone } =
    useDialogForCheckPlannedEvent()

  const title =
    data?.mode === 'done'
      ? 'Segna come fatto'
      : data?.mode === 'missed'
        ? 'Segna come saltato'
        : data?.mode === 'move'
          ? 'Sposta'
          : data?.mode === 'update-notes'
            ? 'Aggiorna note'
            : '???' // Should never happen.

  const [enableNoteInput, setEnableNoteInput] = useState(INITIAL_ENABLE_NOTE)
  const [notesInputValue, setNotesInputValue] = useState(INITIAL_INPUT_VALUE)
  const [dateInputValue, setDateInputValue] = useState(getTodayLocalDate())
  useEffect(() => {
    if (isOpen) {
      if (data?.mode === 'done') {
        // This helps to copy Planned Event Notes into Date Notes.
        if (data.todo.notes) {
          setEnableNoteInput(true)
          setNotesInputValue(data.todo.notes)
        } else {
          setEnableNoteInput(false)
          setNotesInputValue('')
        }
      } else if (data?.mode === 'move') {
        setDateInputValue(data.date)
      } else if (data?.mode === 'update-notes') {
        if (data.todo.notes) {
          setEnableNoteInput(true)
          setNotesInputValue(data.todo.notes)
        } else {
          setEnableNoteInput(false)
          setNotesInputValue('')
        }
      }
    } else {
      setEnableNoteInput(INITIAL_ENABLE_NOTE)
      setNotesInputValue(INITIAL_INPUT_VALUE)
    }
  }, [isOpen, data])

  return (
    <>
      {isOpen && (
        <GenericDialog
          onClose={closeDialog}
          labelOnClose='Indietro'
          title={title}
        >
          <div className='p-4'>
            {data?.mode === 'done' && (
              <>
                <p>{'Confermi di aver svolto questa attività?'}</p>
                {!!data.calendar.usesNotes && (
                  <NotesFieldEditor
                    enableNoteInput={enableNoteInput}
                    setEnableNoteInput={setEnableNoteInput}
                    inputValue={notesInputValue}
                    setInputValue={setNotesInputValue}
                  />
                )}
              </>
            )}

            {data?.mode === 'missed' && (
              <>
                <p>{'Confermi di voler saltare questa attività?'}</p>
              </>
            )}

            {data?.mode === 'move' && (
              <>
                <p>{'Confermi di voler spostare questa attività?'}</p>
                <span className='pr-2'>{'Data: '}</span>
                <input
                  type='date'
                  className='px-2 py-1 rounded-md'
                  value={dateInputValue}
                  onInput={event => {
                    const newDate = event.currentTarget.value // Es. "2024-11-15"
                    // TODO: Check if it's valid
                    setDateInputValue(newDate)
                  }}
                />
              </>
            )}

            {data?.mode === 'update-notes' && (
              <>
                {!!data.calendar.usesNotes && (
                  <>
                    <p>{'Confermi di voler aggiornare questa nota?'}</p>
                    <NotesFieldEditor
                      enableNoteInput={enableNoteInput}
                      setEnableNoteInput={setEnableNoteInput}
                      inputValue={notesInputValue}
                      setInputValue={setNotesInputValue}
                    />
                  </>
                )}
              </>
            )}
          </div>
          <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={() => {
                let notes: undefined | string = undefined
                if (
                  (data?.mode === 'done' || data?.mode === 'update-notes') &&
                  enableNoteInput
                ) {
                  // TODO: Duplicated code (*sdcn)
                  notes = notesInputValue.trim()
                  if (notes.length < 2 || notes.length > 300) {
                    alert('Nota non valida: minimo 2 massimo 300 caratteri')
                    return
                  }
                }

                if (data?.mode === 'done') {
                  confirmProgressDone(notes)
                }
                if (data?.mode === 'missed') {
                  confirmProgressDone(undefined)
                }
                if (data?.mode === 'move') {
                  // FIXME: Validate local date
                  confirmProgressDone(dateInputValue)
                }
                if (data?.mode === 'update-notes') {
                  confirmProgressDone(notes)
                }
              }}
            >
              {'Conferma'}
            </button>
          </div>
        </GenericDialog>
      )}
    </>
  )
}
