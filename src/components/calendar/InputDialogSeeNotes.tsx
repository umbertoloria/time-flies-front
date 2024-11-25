import { FC } from 'react'
import { useUXDialogForSeeNotes } from '../../context/UXContextDialogForSeeNotes.tsx'
import { GenericDialog } from './GenericDialog.tsx'

export const InputDialogSeeNotes: FC = () => {
  const { isOpen, data, closeDialog } = useUXDialogForSeeNotes()

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
