import { FC, PropsWithChildren } from 'react'
import classNames from 'classnames'

export const ColouredLabel: FC<
  PropsWithChildren<{
    bold?: boolean
    blurText?: boolean
  }>
> = props => {
  return (
    <span
      className={classNames(
        'inline-block text-xs px-1.5 py-0.5 rounded-md border-2 border-gray-300',
        {
          'font-bold': props.bold,
          'text-gray-500': props.blurText,
        }
      )}
    >
      {props.children}
    </span>
  )
}
