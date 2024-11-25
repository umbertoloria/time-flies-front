import { FC } from 'react'
import { useDialogForSeeNotes } from './ContextDialogForSeeNotes.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'

export const DialogSeeNotes: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForSeeNotes()

  return (
    <>
      {isOpen && (
        <GenericDialog
          onClose={closeDialog}
          labelOnClose='Indietro'
          title='Note'
        >
          <div className='p-4'>{data?.notes}</div>
        </GenericDialog>
      )}
    </>
  )
}
