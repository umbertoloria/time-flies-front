import { FC } from 'react'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { useDialogForInsertNewPlannedEvent } from './ContextDialogForInsertNewPlannedEvent.tsx'

export const DialogForInsertNewPlannedEvent: FC = () => {
  const { isOpen, closeDialog, confirmProgressToDo } =
    useDialogForInsertNewPlannedEvent()

  return (
    <>
      {isOpen && (
        <GenericDialog
          onClose={closeDialog}
          labelOnClose='Indietro'
          title='Segna come pianificato'
        >
          <div className='p-4'>
            {'Confermi di voler pianificare questa attività?'}
          </div>
          <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={confirmProgressToDo}
            >
              {'Conferma'}
            </button>
          </div>
        </GenericDialog>
      )}
    </>
  )
}
