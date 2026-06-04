'use client'

import { useEffect, useState } from 'react'
import { useLogto, type IdTokenClaims } from '@logto/react'
import {
  LogtoProviderClient,
  PAGE_AFTER_LOGIN,
  PAGE_AFTER_LOGOUT,
} from '@/app/logto-provider'
import { TF_API } from '@/remote/remote'

export default function () {
  return (
    <LogtoProviderClient>
      <AccountPage />
    </LogtoProviderClient>
  )
}

const AccountPage = () => {
  const { signIn, signOut, isAuthenticated, getIdTokenClaims } = useLogto()
  const [user, setUser] = useState<IdTokenClaims>()

  useEffect(() => {
    ;(async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims()
        setUser(claims)
      }
    })()
  }, [getIdTokenClaims, isAuthenticated])

  return (
    <>
      Endpoint:"{process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!}"<br />
      AppId:"{process.env.NEXT_PUBLIC_LOGTO_APP_ID!}"<br />
      Login:"{PAGE_AFTER_LOGIN}"<br />
      Logout:"{PAGE_AFTER_LOGOUT}"<br />
      TF_API:"{TF_API}"<br />
      API:"{process.env.NEXT_PUBLIC_API_ENDPOINT!}"<br />
      {isAuthenticated ? (
        <button
          className='btn-primary'
          onClick={() => signOut(PAGE_AFTER_LOGOUT).catch(console.error)}
        >
          Sign Out
        </button>
      ) : (
        <button
          className='btn-primary'
          onClick={() => signIn(PAGE_AFTER_LOGIN).catch(console.error)}
        >
          Sign In
        </button>
      )}
      {isAuthenticated && user && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(user).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
