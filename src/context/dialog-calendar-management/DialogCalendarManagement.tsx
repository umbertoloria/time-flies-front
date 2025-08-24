import { FC, useEffect, useRef } from 'react'
import { GenericDialog } from '../../components/calendar/GenericDialog.tsx'
import { useDialogForCalendarManagement } from './ContextDialogForCalendarManagement.tsx'
import { regexpHexColorRRGGBB } from '../../lib/utils.ts'

export const DialogCalendarManagement: FC = () => {
  const { isOpen, data, closeDialog, confirmOperation } =
    useDialogForCalendarManagement()

  const title =
    data?.mode === 'insert'
      ? 'Create calendar'
      : data?.mode === 'update'
        ? 'Edit calendar'
        : '???' // Should never happen.

  const inputName = useRef<HTMLInputElement>(null)
  const inputColor = useRef<HTMLInputElement>(null)
  const inputPlannedColor = useRef<HTMLInputElement>(null)
  const inputUsesNotes = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!isOpen) {
      // No need to reset inputs since the inputs are fresh every time.
    } else {
      if (data?.mode === 'update') {
        if (inputName.current) {
          inputName.current.value = data.calendar.name
        }
        if (inputColor.current) {
          inputColor.current.value = data.calendar.color
        }
        if (inputPlannedColor.current) {
          inputPlannedColor.current.value = data.calendar.plannedColor
        }
        if (inputUsesNotes.current) {
          inputUsesNotes.current.checked = data.calendar.usesNotes || false
        }
      }
    }
  }, [isOpen, data])

  return (
    <>
      {isOpen && (
        <GenericDialog onClose={closeDialog} labelOnClose='Close' title={title}>
          <div className='p-4'>
            {(data?.mode === 'insert' || data?.mode === 'update') && (
              <>
                <div className='pt-2'>
                  {'Name'}
                  <input
                    type='text'
                    ref={inputName}
                    className='block w-full px-2 py-1 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900 bg-white text-gray-700'
                    disabled={data.loading}
                  />
                </div>
                <div className='pt-2'>
                  {'Color'}
                  <input
                    type='text'
                    ref={inputColor}
                    className='block w-full px-2 py-1 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900 bg-white text-gray-700'
                    placeholder='Es. "#115599"'
                    disabled={data.loading}
                  />
                </div>
                <div className='pt-2'>
                  {'Color for todos (lighter)'}
                  <input
                    type='text'
                    ref={inputPlannedColor}
                    className='block w-full px-2 py-1 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900 bg-white text-gray-700'
                    placeholder='Es. "#115599"'
                    disabled={data.loading}
                  />
                </div>
                <div className='pt-2'>
                  {'Enable notes'}
                  <input
                    type='checkbox'
                    className='inline ml-1'
                    ref={inputUsesNotes}
                  />
                </div>
              </>
            )}
          </div>
          <div className='flex items-center justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600'>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={() => {
                if (data?.mode === 'insert' || data?.mode === 'update') {
                  // Validation
                  const name = (inputName.current?.value || '').trim()
                  if (name.length < 2 || name.length > 300) {
                    alert('Nome non valido: minimo 2 massimo 300 caratteri')
                    return
                  }

                  const color = (inputColor.current?.value || '').trim()
                  if (!regexpHexColorRRGGBB.test(color)) {
                    alert('Colore non valido')
                    return
                  }
                  const plannedColor = (
                    inputPlannedColor.current?.value || ''
                  ).trim()
                  if (!regexpHexColorRRGGBB.test(plannedColor)) {
                    alert(
                      'Colore leggero non valido: formato "115599" for "#115599"'
                    )
                    return
                  }
                  const usesNotes = inputUsesNotes.current?.checked || false
                  confirmOperation(name, color, plannedColor, usesNotes)
                }
              }}
            >
              {'Confirm'}
            </button>
          </div>
        </GenericDialog>
      )}
    </>
  )
}
