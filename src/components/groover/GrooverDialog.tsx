import { FC, useEffect } from 'react'
import { useGrooverDialog } from '../../context/UXContext.tsx'
import { GenericDialog } from '../calendar/GenericDialog.tsx'
import { createSheet } from './lib/builder.ts'
import { renderNewScoreInApp } from './lib/render.ts'
import { KICK_PATTERN_24_I____I___K } from './lib/drums-patterns/kick-patterns.ts'
import { SNARE_PATTERN_24_BACKBEAT } from './lib/drums-patterns/snare-patterns.ts'
import { TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_ } from './lib/drums-patterns/top-patterns.ts'

export const GrooverDialog: FC = () => {
  const { isOpen, data, closeDialog } = useGrooverDialog()

  useEffect(() => {
    if (!isOpen || !data) {
      return
    }
    createSheet({
      topPattern: TOP_PATTERN_HH_IX_X_X_X_X_X_X_X_,
      snarePattern: SNARE_PATTERN_24_BACKBEAT,
      kickPattern: KICK_PATTERN_24_I____I___K,
    })
      .then(xmlScore => renderNewScoreInApp(xmlScore))
      .catch(err => {
        console.error(err)
      })
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
