'use client'

import { ReactNode } from 'react'
import { LogtoProvider, type LogtoConfig } from '@logto/react'

const config: LogtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
}

export function LogtoProviderClient({ children }: { children: ReactNode }) {
  return <LogtoProvider config={config}>{children}</LogtoProvider>
}

export const PAGE_AFTER_LOGOUT = process.env.NEXT_PUBLIC_PAGE_AFTER_LOGOUT!

export const PAGE_AFTER_LOGIN = process.env.NEXT_PUBLIC_PAGE_AFTER_LOGIN!
