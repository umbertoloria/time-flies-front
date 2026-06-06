'use client'

import { useEffect, useState } from 'react'

export const useWrapperForCreateResource = <T>(
  fn: () => Promise<T>,
  skipFirstRun?: boolean
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
    // console.debug('useWrapperForCreateResource', data, 'start loading')
    setData(old => (old ? { ...old, loading: true } : undefined))
    fn()
      .then(data => {
        // console.debug('useWrapperForCreateResource', data, 'stop loading ok')
        setData({ data, loading: false })
      })
      .catch(err => {
        // console.error('useWrapperForCreateResource', data, 'stop loading error')
        setData(old => (old ? { ...old, loading: false } : undefined))
        console.error(err)
      })
  }

  useEffect(() => {
    if (skipFirstRun) {
      return
    }
    fnfn()
  }, [])

  return [
    data
      ? {
          loading: data.loading,
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
