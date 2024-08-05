import { useAuth } from '../../auth/AuthContext.tsx'
import { backendLogoutAction } from '../../remote/remote'
import { Link, useLocation } from 'react-router-dom'

export const Navbar = () => {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <nav className='bg-gray-200 text-gray-900 px-4'>
      <ul className='flex items-center'>
        <li className='py-2 px-4'>
          <Link to='/' className='no-underline hover:underline'>
            Home
          </Link>
        </li>
        {user ? (
          <>
            <li className='py-2 px-4'>
              <Link to='/account' className='no-underline hover:underline'>
                {user.email}
              </Link>
            </li>
            <li className='py-2 px-4'>
              <Link
                to={backendLogoutAction}
                className='no-underline hover:underline'
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className='py-2 px-4'>
              {/* Consider "isLoading" to disable click */}
              <Link to='/login' className='no-underline hover:underline'>
                Login
              </Link>
            </li>
          </>
        )}

        <li className='py-2 px-4'>
          <Link to='/about' className='no-underline hover:underline'>
            About
          </Link>
        </li>
        <li className='py-2 px-4'>
          <Link to='/error' className='no-underline hover:underline'>
            Error
          </Link>
        </li>

        <li className='text-sm flex items-center space-x-1 ml-auto'>
          <span>URL:</span>
          <input
            className='w-75px p-1 bg-white text-sm rounded-lg'
            type='text'
            readOnly
            value={location.pathname}
          />
        </li>
      </ul>
    </nav>
  )
}
