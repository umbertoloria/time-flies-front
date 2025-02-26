import { FC } from 'react'
import { useDialogForCalendarDateManagement } from './ContextDialogForCalendarDateManagement.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'

export const DialogCalendarDateManagement: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForCalendarDateManagement()

  return (
    <>
      {isOpen && (
        <GenericDialog
          onClose={closeDialog}
          labelOnClose='Indietro'
          title='Attività'
        >
          {!!data && (
            <>
              {!!data.notes && (
                <>
                  <div className='p-4'>
                    <p>
                      <i>Note:</i> {data.notes}
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </GenericDialog>
      )}
    </>
  )
}
