'use client'

import { useEffect, useState } from 'react'
import { type IdTokenClaims, useLogto } from '@logto/react'
import {
  LogtoProviderClient,
  PAGE_AFTER_LOGIN,
  PAGE_AFTER_LOGOUT,
} from '@/app/logto-provider'

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
