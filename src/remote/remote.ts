import axios from 'axios'
import { TAuthStatus, TCalendar, TCalendarSDK } from './sdk/types'

const backendURL = import.meta.env.VITE_BACKEND_ENDPOINT

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

export const authStatus = () =>
  api.get('?a=status').then<TAuthStatus>(({ data }) => data)

export const readCalendar = (id: number) =>
  api.get(`?a=calendar&p1=${id}`).then<TCalendar>(({ data }) => data)

export const checkDateWithSuccess = (
  id: number,
  localDate: string
): Promise<TCalendarSDK.CheckDateWithSuccessPromiseOutput> =>
  api
    .post(`?a=calendar&p1=${id}&p2=${localDate}`)
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid') {
        return 'invalid'
      }
      throw err
    })

export const authLogin = (email: string, password: string) =>
  api
    .post('?a=login', makeFormData({ email, password }))
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid') {
        return 'invalid'
      }
      throw err
    })

export const authLogout = () =>
  api
    .get('?a=logout')
    .then<'ok'>(() => 'ok')
    .catch(err => {
      if (err.response?.data === 'invalid') {
        return 'invalid'
      }
      throw err
    })

function makeFormData(args: Record<string, string>) {
  const formData = new FormData()
  for (const key in args) {
    const value = args[key]
    formData.set(key, value)
  }
  return formData
}
