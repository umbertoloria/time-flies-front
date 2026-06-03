'use client'

import '../css/globals.css'
import '../css/agenda.css'

import { ReactNode } from 'react'
import { LogtoProvider, type LogtoConfig } from '@logto/react'

const config: LogtoConfig = {
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Time Flies</title>
      </head>
      <body>
        <LogtoProvider config={config}>{children}</LogtoProvider>
        {/*
    // FIXME: import this library
    <!-- One will work and the other won't, in both DEV and PROD -->
		<script src="/lib-js/opensheetmusicdisplay.min.js"></script>
		<script src="/app/time-flies/lib-js/opensheetmusicdisplay.min.js"></script>
		<!-- you need to provide the .js file, see README.md -->
		*/}
      </body>
    </html>
  )
}
