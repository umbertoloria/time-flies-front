import { FC } from 'react'
import Link from 'next/link'
import { pathAccountPage, pathHomePage, pathLoginPage } from '@/app/routing'
import { useAuth } from '@/context/AuthContext'
import { resetAuthData } from '@/remote/auth'

export const Navbar = () => {
  const { user } = useAuth()

  return (
    <nav className='bg-gray-200 text-gray-900 px-4'>
      <ul className='w-full flex items-center justify-center'>
        <NavbarItem to={pathHomePage} label='Dashboard' />
        {user ? (
          <>
            {/* // TODO: Schedule Page disabled
            <NavbarItem to={pathSchedulePage} label='Schedule' />
            */}
            <NavbarItem to={pathAccountPage} label='Account' />
            <NavbarItem
              onClick={() => {
                resetAuthData()
                location.href = pathHomePage
              }}
              label='Logout'
            />
          </>
        ) : (
          <>
            {/* Consider "isLoading" to disable click */}
            <NavbarItem to={pathLoginPage} label='Login' />
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
