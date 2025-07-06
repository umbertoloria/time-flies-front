import { FC, useEffect, useState } from 'react'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { useDialogForInsertNewPlannedEvent } from './ContextDialogForInsertNewPlannedEvent.tsx'
import { NotesFieldEditor } from '../dialog-insert-new-goal/DialogForInsertNewGoal.tsx'

const INITIAL_ENABLE_NOTE = false
const INITIAL_INPUT_VALUE = ''
export const DialogForInsertNewPlannedEvent: FC = () => {
  // TODO: Unify this with "DialogForInsertNewGoal"?

  const { isOpen, closeDialog, confirmProgressToDo } =
    useDialogForInsertNewPlannedEvent()

  const [enableNoteInput, setEnableNoteInput] = useState(INITIAL_ENABLE_NOTE)
  const [inputValue, setInputValue] = useState(INITIAL_INPUT_VALUE)
  useEffect(() => {
    if (!isOpen) {
      setEnableNoteInput(INITIAL_ENABLE_NOTE)
      setInputValue(INITIAL_INPUT_VALUE)
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <GenericDialog
          onClose={closeDialog}
          labelOnClose='Indietro'
          title='Segna come pianificato'
        >
          <div className='p-4'>
            <p>{'Confermi di voler pianificare questa attività?'}</p>
            <NotesFieldEditor
              enableNoteInput={enableNoteInput}
              setEnableNoteInput={setEnableNoteInput}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </div>
          <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={() => {
                let notes: undefined | string = undefined
                if (enableNoteInput) {
                  // TODO: Duplicated code (*sdcn)
                  notes = inputValue.trim()
                  if (notes.length < 2 || notes.length > 300) {
                    alert('Nota non valida: minimo 2 massimo 300 caratteri')
                    return
                  }
                }
                confirmProgressToDo(notes)
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
