import { FC } from 'react'
import { useUXDialogForInsertNewGoal } from '../../context/UXContext.tsx'
import { GenericDialog } from './GenericDialog.tsx'

export const InputDialogInsertNewGoal: FC = () => {
  const { isOpen, closeDialog, confirmProgressDone } =
    useUXDialogForInsertNewGoal()

  return (
    <>
      <div>
        {isOpen && (
          <GenericDialog
            onClose={closeDialog}
            labelOnClose='Indietro'
            title='Segna come fatto'
          >
            <div className='p-4'>
              Confermi di aver svolto questa attività?
              {/*<input
                type='text'
                id='input-field'
                className='block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900'
                value={inputValue}
                onChange={handleInputChange}
              />*/}
            </div>
            <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
              <button
                type='button'
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={confirmProgressDone}
              >
                Conferma
              </button>
            </div>
          </GenericDialog>
        )}
      </div>
    </>
  )
}
