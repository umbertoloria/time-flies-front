import { FC } from 'react'
import { useUXDialogForSeeNotes } from '../../context/UXContext.tsx'

// TODO: Use "GenericDialog.tsx" component
export const InputDialogSeeNotes: FC = () => {
  const { isOpen, data, closeDialog } = useUXDialogForSeeNotes()

  return (
    <>
      <div>
        {isOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50'>
            <div className='relative w-full max-w-md max-h-full'>
              <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                <div className='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
                  <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                    Note
                  </h3>
                  <button
                    type='button'
                    className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                    onClick={closeDialog}
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
                <div className='p-4'>{data?.notes}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
