import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.tsx'
import { backendLogoutAction } from '../../remote/remote'

export const Navbar = () => {
  const { user } = useAuth()

  return (
    <nav className='bg-gray-200 text-gray-900 px-4'>
      <ul className='w-full flex items-center justify-center'>
        <NavbarItem to='/' label='Home' />
        {user ? (
          <>
            <NavbarItem to='/account' label={user.email} />
            <NavbarItem to={backendLogoutAction} label='Logout' />
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
  to: string
  label: string
}> = props => (
  <li className='py-2 px-4'>
    <Link to={props.to} className='no-underline hover:underline'>
      {props.label}
    </Link>
  </li>
)
