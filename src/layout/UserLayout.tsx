import { FC, PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext.tsx'
import { Navbar } from '../components/navbar/Navbar.tsx'
import { UXProvider } from '../context/UXContext.tsx'

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
