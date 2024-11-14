import axios from 'axios'
import { TAuthStatus, TCalendar, TCalendarSDK, TSchedule } from './sdk/types'

const backendURL = import.meta.env.VITE_BACKEND_ENDPOINT

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

export const authStatus = () =>
  api.get('?a=status').then<TAuthStatus>(({ data }) => data)
/*// Debug only.
export const authStatus = (): Promise<TAuthStatus> =>
  Promise.resolve({
    user: {
      id: 1,
      email: 'test@test.com',
    },
  })*/

export const readCalendar = (id: number) =>
  api.get(`?a=calendar-read&id=${id}`).then<TCalendar>(({ data }) => data)

export const checkDateWithSuccess = (
  id: number,
  localDate: string
): Promise<TCalendarSDK.CheckDateWithSuccessPromiseOutput> =>
  api
    .post(
      '?a=calendar-date-create',
      makeFormData({ id: `${id}`, 'local-date': localDate })
    )
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

// Exercise
export const readSchedule = (): Promise<TSchedule> => {
  return Promise.resolve({
    groups: [
      {
        name: 'Tecnica',
        exercises: [
          {
            name: '8": resistenza mano singola',
            records: [
              {
                bpm: 130,
                minutes: 5,
                hand: 'sx',
              },
              {
                bpm: 145,
                minutes: 3,
                hand: 'sx',
              },
              {
                bpm: 170,
                minutes: 1,
                hand: 'sx',
              },
            ],
          },
          {
            name: '8": Stone Killer 1->8',
            records: [
              {
                bpm: 160,
              },
            ],
          },
          {
            name: '16" su 8": BPPP|...|BBBB',
            records: [
              {
                bpm: 150,
              },
              {
                bpm: 160,
              },
            ],
          },
          {
            name: 'Stick Control: 4 e 6',
            records: [
              {
                bpm: 80,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 85,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 90,
                dynamic: 'mezzo forte',
              },
            ],
          },
          {
            name: 'Stick Control: 4 e 8',
            records: [
              {
                bpm: 70,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 75,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 80,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 85,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 90,
                dynamic: 'mezzo forte',
              },
            ],
          },
          {
            name: 'Stick Control: intro',
            records: [
              {
                bpm: 140,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 160,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 180,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 200,
                dynamic: 'mezzo forte',
              },
              {
                bpm: 90,
                dynamic: 'mezzo forte',
              },
            ],
          },
          {
            name: '8": Unisono mani',
            records: [
              {
                bpm: 100,
                minutes: 5,
              },
              {
                bpm: 120,
                minutes: 3,
              },
              {
                bpm: 150,
                minutes: 1,
              },
            ],
          },
        ],
      },
    ],
  })
}
