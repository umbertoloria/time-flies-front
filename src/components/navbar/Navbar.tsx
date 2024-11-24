import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'
import { getSDK } from '../../remote/remote'
import { baseRoot } from '../../main.tsx'

const { authLogout } = getSDK()
export const Navbar = () => {
  const { user } = useAuth()

  return (
    <nav className='bg-gray-200 text-gray-900 px-4'>
      <ul className='w-full flex items-center justify-center'>
        <NavbarItem to='/' label='Dashboard' />
        {user ? (
          <>
            <NavbarItem to='/schedule' label='Schedule' />
            <NavbarItem to='/account' label={user.email} />
            <NavbarItem
              onClick={() => {
                authLogout().then(() => {
                  location.href = baseRoot
                })
              }}
              label='Logout'
            />
          </>
        ) : (
          <>
            {/* Consider "isLoading" to disable click */}
            <NavbarItem to='/login' label='Login' />
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
