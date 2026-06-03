'use client'

import { FC } from 'react'
import Link from 'next/link'
import { useLogto } from '@logto/react'
import { pathAccountPage, pathHomePage } from '@/app/routing'
import { PAGE_AFTER_LOGIN, PAGE_AFTER_LOGOUT } from '@/app/logto-provider'
import { resetAuthData } from '@/remote/auth'

export const Navbar = () => {
  const { signIn, signOut, isAuthenticated } = useLogto()

  return (
    <nav className='bg-gray-200 text-gray-900 px-4'>
      <ul className='w-full flex items-center justify-center'>
        <NavbarItem to={pathHomePage} label='Dashboard' />
        {isAuthenticated ? (
          <>
            {/* // TODO: Schedule Page disabled
            <NavbarItem to={pathSchedulePage} label='Schedule' />
            */}
            <NavbarItem to={pathAccountPage} label='Account' />
            <NavbarItem
              onClick={() => {
                resetAuthData()
                signOut(PAGE_AFTER_LOGOUT).catch(console.error)
              }}
              label='Logout'
            />
          </>
        ) : (
          <>
            {/* Consider "isLoading" to disable click */}
            <NavbarItem
              onClick={() => signIn(PAGE_AFTER_LOGIN).catch(console.error)}
              label='Login'
            />
          </>
        )}
      </ul>
    </nav>
  )
}

const NavbarItem: FC<{
  to?: string
  label: string
  onClick?: () => void
}> = props => (
  <li className='py-2 px-4'>
    <Link
      onClick={e => {
        if (props.onClick) {
          e.preventDefault()
          props.onClick()
        }
      }}
      href={props.to || ''}
      className='no-underline hover:underline'
    >
      {props.label}
    </Link>
  </li>
)
