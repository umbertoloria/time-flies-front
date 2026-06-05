'use client'

import { ReactNode } from 'react'
import { type LogtoConfig, LogtoProvider } from '@logto/react'

export const LOGTO_API_ID = process.env.NEXT_PUBLIC_LOGTO_API_ID!

export const getPageAfterSignOut = () =>
  process.env.NEXT_PUBLIC_PAGE_AFTER_SIGNOUT!

export const getPageAfterSignIn = () =>
  `${process.env.NEXT_PUBLIC_PAGE_AFTER_SIGNOUT}callback/`

const config: LogtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
  // scopes: [UserScope.CustomData],
  resources: [LOGTO_API_ID],
}

export function LogtoProviderClient({ children }: { children: ReactNode }) {
  return <LogtoProvider config={config}>{children}</LogtoProvider>
}
