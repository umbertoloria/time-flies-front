import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page.tsx'
import HomePageContent from './pages/HomePage.tsx'
import LoginPageContent from './pages/LoginPage.tsx'

export const baseRoot = '/app/time-flies' as const

export const pathHomePage = '/'
export const pathLoginPage = '/login'
export const pathAccountPage = '/account'

const router = createHashRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <HomePageContent />,
        },
        {
          path: pathLoginPage,
          element: <LoginPageContent />,
        },
      ],
    },
  ],
  {
    basename: '',
    // basename: baseRoot, // This for Browser Router.
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
