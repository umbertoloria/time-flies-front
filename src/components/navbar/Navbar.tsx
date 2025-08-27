import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'
import { getSDK } from '../../remote/remote'
import {
  baseRoot,
  pathAccountPage,
  pathHomePage,
  pathLoginPage,
} from '../../main.tsx'
import { resetAuthData } from '../../remote/auth.ts'

const { authLogout } = getSDK()
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
                authLogout().then(() => {
                  resetAuthData()
                  location.href = baseRoot
                })
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
      to={props.to || ''}
      className='no-underline hover:underline'
    >
      {props.label}
    </Link>
  </li>
)
