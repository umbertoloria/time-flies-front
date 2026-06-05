'use client'

import { useEffect, useState } from 'react'
import { type IdTokenClaims, useLogto } from '@logto/react'
import {
  getPageAfterSignIn,
  getPageAfterSignOut,
  LogtoProviderClient,
} from '@/app/logto-provider'
import { UserLayout } from '@/layout/UserLayout'

export default function () {
  return (
    <LogtoProviderClient>
      <UserLayout>
        <AccountPage />
      </UserLayout>
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
    <section className='p-8'>
      {isAuthenticated ? (
        <button
          className='btn-primary'
          onClick={() => signOut(getPageAfterSignOut()).catch(console.error)}
        >
          Sign Out
        </button>
      ) : (
        <button
          className='btn-primary'
          onClick={() => signIn(getPageAfterSignIn()).catch(console.error)}
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
    </section>
  )
}
