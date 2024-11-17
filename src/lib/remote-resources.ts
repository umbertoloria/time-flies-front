import { useEffect, useState } from 'react'

export const useWrapperForCreateResource = <T>(
  fn: () => Promise<T>
): [
  data:
    | undefined
    | {
        data: T
        loading: boolean
      },
  {
    refetch: () => void
  },
] => {
  // TODO: Improve mapping
  const [data, setData] = useState<undefined | { data: T; loading: boolean }>(
    undefined
  )

  const fnfn = () => {
    setData(old => (old ? { ...old, loading: true } : undefined))
    fn()
      .then(data => {
        setData({ data, loading: false })
      })
      .catch(err => {
        setData(old => (old ? { ...old, loading: false } : undefined))
        console.error(err)
      })
  }

  useEffect(() => {
    fnfn()
  }, [])

  return [
    data
      ? {
          loading: false,
          data: data.data,
        }
      : undefined,
    {
      refetch: () => {
        fnfn()
      },
    },
  ]
}
