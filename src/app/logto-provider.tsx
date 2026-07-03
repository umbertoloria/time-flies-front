'use client'

import { ReactNode } from 'react'
import { type LogtoConfig, LogtoProvider } from '@logto/react'

export const getPageAfterSignOut = () =>
  process.env.NEXT_PUBLIC_PAGE_AFTER_SIGNOUT!

export const getPageAfterSignIn = () =>
  `${process.env.NEXT_PUBLIC_PAGE_AFTER_SIGNOUT}callback/`

const config: LogtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
  // scopes: [UserScope.CustomData],
  // resources: [],
}

export function LogtoProviderClient({ children }: { children: ReactNode }) {
  return <LogtoProvider config={config}>{children}</LogtoProvider>
}
