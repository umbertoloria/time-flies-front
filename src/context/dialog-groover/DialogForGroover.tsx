'use client'

import { FC, useEffect } from 'react'
import { GenericDialog } from '@/components/calendar/GenericDialog'
import { createSheet } from '@/components/groover/lib/builder'
import { mergeSnareAndGhostsTogether } from '@/components/groover/lib/drums-patterns/snare-patterns'
import { renderNewScoreInApp } from '@/components/groover/lib/render'
import { useDialogForGroover } from '@/context/dialog-groover/ContextDialogForGroover'

export const DialogForGroover: FC = () => {
  const { isOpen, data, closeDialog } = useDialogForGroover()

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
