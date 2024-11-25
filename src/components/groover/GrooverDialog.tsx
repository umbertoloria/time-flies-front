import { FC, useEffect } from 'react'
import { useUXDialogForGroover } from '../../context/UXContextDialogForGroover.tsx'
import { GenericDialog } from '../calendar/GenericDialog.tsx'
import { createSheet } from './lib/builder.ts'
import { renderNewScoreInApp } from './lib/render.ts'
import { mergeSnareAndGhostsTogether } from './lib/drums-patterns/snare-patterns.ts'

export const GrooverDialog: FC = () => {
  const { isOpen, data, closeDialog } = useUXDialogForGroover()

  useEffect(() => {
    if (!isOpen || !data) {
      return
    }
    createSheet({
      topPattern__: data.hhr,
      snarePattern: mergeSnareAndGhostsTogether('    W       W   ', data.ghost),
      kickPattern_: data.bass,
    }).then(xmlScore => renderNewScoreInApp(xmlScore))
  }, [isOpen, data])

  if (!isOpen) {
    return <></>
  }
  return (
    <GenericDialog onClose={closeDialog} labelOnClose='Chiudi' title='Groove'>
      {data ? (
        <>
          <div id='render-score-here'></div>
        </>
      ) : (
        <p>{'No pattern data'}</p>
      )}
    </GenericDialog>
  )
}
