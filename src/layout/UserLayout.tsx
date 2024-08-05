import { FC, PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from '../auth/AuthContext.tsx'
import { Navbar } from '../components/navbar/Navbar.tsx'

export const UserLayout: FC<PropsWithChildren> = props => {
  return (
    <AuthProvider>
      <Navbar />
      <UserLayoutInner>{props.children}</UserLayoutInner>
    </AuthProvider>
  )
}

const UserLayoutInner: FC<PropsWithChildren> = props => {
  const { user } = useAuth()
  return <>{user ? <>{props.children}</> : <>{/* None */}</>}</>
}
