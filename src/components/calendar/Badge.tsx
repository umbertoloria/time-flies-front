import { FC, PropsWithChildren } from 'react'

export const Badge: FC<PropsWithChildren> = props => {
  return (
    <span className='bg-gray-400 px-1 py-0.5 rounded'>{props.children}</span>
  )
}
