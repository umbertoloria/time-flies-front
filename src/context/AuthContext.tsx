'use client'

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { type IdTokenClaims, useLogto } from '@logto/react'
import { Optional } from '@silverhand/essentials'
import { PAGE_AFTER_LOGIN } from '@/app/logto-provider'

const AuthContext = createContext<{
  user: IdTokenClaims | undefined
}>({
  user: undefined,
})

export const AuthProvider: FC<PropsWithChildren> = props => {
  const { isAuthenticated, isLoading, signIn, getIdTokenClaims } = useLogto()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signIn(PAGE_AFTER_LOGIN).catch(console.error)
    }
  }, [isLoading, isAuthenticated, signIn])

  const [user, setUser] = useState<Optional<IdTokenClaims>>()

  useEffect(() => {
    ;(async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims()
        setUser(claims)
      }
    })()
  }, [isAuthenticated, getIdTokenClaims])

  if (isLoading && !isAuthenticated) {
    return <></>
  }
  if (!user) {
    return <></>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
