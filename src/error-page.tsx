import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError()
  console.error(error)

  return (
    <section className='text-gray-700 p-8'>
      <h1 className='text-2xl font-bold'>Oops!</h1>
      <p className='mt-4'>
        <i>{error.statusText || error.message}</i>
      </p>
    </section>
  )
}
