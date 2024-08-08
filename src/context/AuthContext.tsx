import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { TAuthUser } from '../remote/sdk/types'
import { authStatus } from '../remote/remote.ts'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext<{
  user: TAuthUser | undefined
  isLoading: boolean
  refresh: () => void
}>({
  user: undefined,
  isLoading: true, // Initing with loading on.
  refresh() {
    // Blank...
  },
})

export const AuthProvider: FC<PropsWithChildren> = props => {
  const navigate = useNavigate()

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
          navigate('/login')
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
