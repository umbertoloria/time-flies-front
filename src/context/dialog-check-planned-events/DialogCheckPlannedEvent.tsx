import { FC, useEffect, useState } from 'react'
import { useDialogForCheckPlannedEvent } from './ContextDialogForCheckPlannedEvents.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import classNames from 'classnames'

const INITIAL_ENABLE_NOTE = false
const INITIAL_INPUT_VALUE = ''
export const DialogCheckPlannedEvent: FC = () => {
  // TODO: Unify this with "DialogForInsertNewGoal"?

  const { isOpen, data, closeDialog, confirmProgressDone } =
    useDialogForCheckPlannedEvent()
  const settingAsMissed = data?.mode === 'missed'

  const [enableNoteInput, setEnableNoteInput] = useState(INITIAL_ENABLE_NOTE)
  const [inputValue, setInputValue] = useState(INITIAL_INPUT_VALUE)
  useEffect(() => {
    if (isOpen) {
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
          title={settingAsMissed ? 'Segna come saltato' : 'Segna come fatto'}
        >
          <div className='p-4'>
            {settingAsMissed ? (
              <>
                <p>{'Confermi di voler saltare questa attività?'}</p>
              </>
            ) : (
              <>
                <p>{'Confermi di aver svolto questa attività?'}</p>
              </>
            )}
            {!settingAsMissed && (
              <div className='pt-2'>
                {'Inserisci note'}
                <input
                  type='checkbox'
                  className='inline ml-1'
                  checked={enableNoteInput}
                  onChange={event => {
                    setEnableNoteInput(event.currentTarget.checked)
                  }}
                />
                <input
                  type='text'
                  id='input-field'
                  className={classNames(
                    'block w-full px-2 py-1  border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900',
                    {
                      'bg-white': enableNoteInput,
                      'bg-gray-100': !enableNoteInput,
                      'text-gray-700': enableNoteInput,
                      'text-gray-500': !enableNoteInput,
                    }
                  )}
                  value={inputValue}
                  disabled={!enableNoteInput}
                  onChange={event => {
                    setInputValue(event.target.value)
                  }}
                />
              </div>
            )}
          </div>
          <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={() => {
                let notes: undefined | string = undefined
                if (enableNoteInput) {
                  notes = inputValue.trim()
                  if (notes.length < 2 || notes.length > 300) {
                    alert('Nota non valida: minimo 2 massimo 300 caratteri')
                    return
                  }
                }
                confirmProgressDone(notes)
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
