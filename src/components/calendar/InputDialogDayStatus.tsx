import { FC } from 'react'
import { useUXInputDialogControls } from '../../context/UXContext.tsx'

// TODO: Clean "InputDialogDayStatus" component
export const InputDialogDayStatus: FC = () => {
  const { isOpen, closeInputDialog, confirmProgressDone } =
    useUXInputDialogControls()

  return (
    <>
      <div>
        {isOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50'>
            <div className='relative w-full max-w-md max-h-full'>
              <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                <div className='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
                  <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                    Segna come fatto
                  </h3>
                  <button
                    type='button'
                    className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                    onClick={closeInputDialog}
                  >
                    Indietro
                    {/*<svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M4.625 4.625l10.75 10.75' />
                      <path d='M15.375 4.625l-10.75 10.75' />
                    </svg>*/}
                  </button>
                </div>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
