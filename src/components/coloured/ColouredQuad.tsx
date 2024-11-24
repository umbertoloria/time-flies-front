import { FC } from 'react'

export const ColouredQuad: FC<{ color: string }> = props => {
  return (
    <div
      className='inline-block w-8 h-7 rounded-sm'
      style={{
        background: props.color,
      }}
    ></div>
  )
}
