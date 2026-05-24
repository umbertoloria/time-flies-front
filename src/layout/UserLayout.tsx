import { FC, PropsWithChildren } from 'react'
import { Navbar } from '@/components/navbar/Navbar'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { UXProvider } from '@/context/UXContext'

export const UserLayout: FC<PropsWithChildren> = props => {
  return (
    <AuthProvider>
      <UXProvider>
        <Navbar />
        <UserLayoutInner>{props.children}</UserLayoutInner>
      </UXProvider>
    </AuthProvider>
  )
}

const UserLayoutInner: FC<PropsWithChildren> = props => {
  const { user } = useAuth()
  return <>{user ? <>{props.children}</> : <>{/* None */}</>}</>
}
