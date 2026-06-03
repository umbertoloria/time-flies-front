'use client'

import { useEffect, useState } from 'react'
import { useLogto, type IdTokenClaims } from '@logto/react'

export default function TestPage() {
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
      Hello, world!
      {isAuthenticated ? (
        <button
          className='btn-primary'
          onClick={() => signOut('http://localhost:3000/')}
        >
          Sign Out
        </button>
      ) : (
        <button
          className='btn-primary'
          onClick={() => signIn('http://localhost:3000/callback/')}
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
