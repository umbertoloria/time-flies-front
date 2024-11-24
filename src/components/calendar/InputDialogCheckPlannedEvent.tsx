import { FC } from 'react'
import { useUXDialogForCheckPlannedEvent } from '../../context/UXContext.tsx'
import { GenericDialog } from './GenericDialog.tsx'

export const InputDialogCheckPlannedEvent: FC = () => {
  const { isOpen, closeDialog, confirmProgressDone } =
    useUXDialogForCheckPlannedEvent()

  return (
    <>
      <div>
        {isOpen && (
          <GenericDialog
            onClose={closeDialog}
            labelOnClose='Indietro'
            title='Segna come fatto'
          >
            <div className='p-4'>Confermi di aver svolto questa attività?</div>
            <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
              <button
                type='button'
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={confirmProgressDone}
              >
                {'Conferma'}
              </button>
            </div>
          </GenericDialog>
        )}
      </div>
    </>
  )
}
