'use client'

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { TAuthUser } from '../remote/sdk/types'
import { getSDK } from '../remote/remote.ts'
import { pathLoginPage } from '@/app/routing'

const AuthContext = createContext<{
  user: TAuthUser | undefined
  isLoading: boolean
  refresh: () => void
}>({
  user: undefined,
  isLoading: true, // Starting with loading on.
  refresh() {
    // Blank...
  },
})

const { authStatus } = getSDK()
export const AuthProvider: FC<PropsWithChildren> = props => {
  const [user, setUser] = useState<TAuthUser | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  function refreshStatus() {
    if (!loading) {
      setLoading(true)
      authStatus()
        .then(authStatus => {
          setUser(authStatus.user)
        })
        .catch(err => {
          if (err.response?.status !== 401) {
            console.error(err)
          }
          setUser(undefined)
          location.href = pathLoginPage
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    refreshStatus()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: loading,
        refresh() {
          refreshStatus()
        },
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
