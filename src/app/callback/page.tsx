'use client'

import { useHandleSignInCallback } from '@logto/react'

export default function HomePage() {
  const { isLoading } = useHandleSignInCallback(() => {
    window.location.href = '/test'
  })

  if (isLoading) {
    return <div>Redirecting...</div>
  }

  return <></>
}
