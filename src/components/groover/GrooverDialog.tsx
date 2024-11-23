import { FC } from 'react'
import { useGrooverDialog } from '../../context/UXContext.tsx'
import { GenericDialog } from '../calendar/GenericDialog.tsx'

export const GrooverDialog: FC = () => {
  const { isOpen, data, closeDialog } = useGrooverDialog()
  if (!isOpen) {
    return <></>
  }
  return (
    <GenericDialog onClose={closeDialog} labelOnClose='Chiudi' title='Groove'>
      {data ? (
        <>
          {/* // TODO: Show pattern in sheet music */}
          <pre>{JSON.stringify(data)}</pre>
        </>
      ) : (
        <p>{'No pattern data'}</p>
      )}
    </GenericDialog>
  )
}
