import { FC } from 'react'
import { useDialogForCalendarDateManagement } from './ContextDialogForCalendarDateManagement.tsx'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { displayDateFromLocalDate } from '../../components/calendar/utils.ts'
import { Badge } from '../../components/calendar/Badge.tsx'

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
              <div className='p-4 flex flex-col gap-1'>
                <p>
                  <Badge>Data</Badge> {displayDateFromLocalDate(data.date)}
                </p>
                {!!data.notes && (
                  <>
                    <p>
                      <Badge>Note</Badge> {data.notes}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </GenericDialog>
      )}
    </>
  )
}
