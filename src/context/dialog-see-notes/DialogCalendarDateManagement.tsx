import { FC } from 'react'
import {
  ContextPartDataNotes,
  useDialogForCalendarDateManagement,
} from './ContextDialogForCalendarDateManagement.tsx'
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
                    <CalendarDayNote notes={data.notes} />
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

const CalendarDayNote: FC<{ notes: ContextPartDataNotes }> = ({ notes }) => {
  return (
    <div>
      <p>
        <Badge>Note</Badge> {notes.text}
      </p>
    </div>
  )
}
