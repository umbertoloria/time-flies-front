'use client'

import { useHandleSignInCallback } from '@logto/react'
import { LogtoProviderClient } from '@/app/logto-provider'

export default function () {
  return (
    <LogtoProviderClient>
      <HomePage />
    </LogtoProviderClient>
  )
}

const HomePage = () => {
  const { isLoading } = useHandleSignInCallback(() => {
    window.location.href = '/'
  })

  if (isLoading) {
    return <div>Redirecting...</div>
  }

  return <></>
}
