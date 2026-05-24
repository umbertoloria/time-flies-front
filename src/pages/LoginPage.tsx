'use client'

import classNames from 'classnames'
import { pathHomePage } from '@/app/routing'
import { setAuthData, sha256 } from '@/remote/auth'
import { getSDK } from '@/remote/remote'

export default function LoginPageContent() {
  return (
    <section className=' p-8'>
      <Login />
    </section>
  )
}

const { authLogin } = getSDK()
const Login = () => {
  // TODO: Implement failed login UX
  const isFailed = false

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
        sha256(password)
          .then(sp =>
            authLogin(email, sp).then(outcome => {
              if (outcome === 'ok') {
                setAuthData(email, sp)
                location.href = pathHomePage
              } else {
                throw new Error()
              }
            })
          )
          .catch(err => {
            console.error(err)
            alert('Login error')
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
