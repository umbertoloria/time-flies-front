import { FC, PropsWithChildren } from 'react'
import { AuthProvider, useUser } from '../auth/user-data.tsx'
import { Navbar } from '../components/navbar/Navbar.tsx'

export const UserLayout: FC<PropsWithChildren> = props => {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <UserLayoutInner>{props.children}</UserLayoutInner>
      </AuthProvider>
    </>
  )
}

const UserLayoutInner: FC<PropsWithChildren> = props => {
  const { user } = useUser()
  return <>{user ? <>{props.children}</> : <>{/* None */}</>}</>
}
