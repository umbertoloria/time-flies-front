import { authLogin } from '../remote/remote.ts'
import classNames from 'classnames'
import { baseRoot } from '../main.tsx'

export default function LoginPage() {
  return (
    <section className=' p-8'>
      <Login />
    </section>
  )
}

const Login = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const isFailed = typeof urlParams.get('failed') === 'string'

  return (
    <form
      method='post'
      className='bg-gray-300 w-80 p-2 radius'
      onSubmit={e => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const email = (formData.get('email') as string) || ''
        const password = (formData.get('password') as string) || ''
        authLogin(email, password).then(() => {
          location.href = baseRoot
        })
      }}
    >
      <fieldset className='flex flex-col gap-2 items-center'>
        <div className='flex gap-2 items-center'>
          <label className='w-32'>Email</label>
          <input
            type='text'
            name='email'
            className={classNames('w-full border-2 rounded', {
              'border-blue-400': !isFailed,
              'border-red-400': isFailed,
            })}
          />
        </div>
        <div className='flex gap-2 items-center'>
          <label className='w-32'>Password</label>
          <input
            type='password'
            name='password'
            className={classNames('w-full border-2 rounded', {
              'border-blue-400': !isFailed,
              'border-red-400': isFailed,
            })}
          />
        </div>
      </fieldset>
      <div className='w-full text-right'>
        <button
          type='submit'
          className='bg-blue-500 text-white w-32 mt-2 mx-auto py-2 rounded-md
					shadow-md hover:shadow-lg transition'
        >
          Login
        </button>
      </div>
    </form>
  )
}
