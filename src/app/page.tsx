'use client'
export const dynamic = 'force-dynamic'

import { LogtoProviderClient } from '@/app/logto-provider'
import { UserLayout } from '@/layout/UserLayout'
import { HomePageContent } from '@/components/HomePageContent'

export default function HomePage() {
  return (
    <LogtoProviderClient>
      <UserLayout>
        <HomePageContent />
      </UserLayout>
    </LogtoProviderClient>
  )
}
