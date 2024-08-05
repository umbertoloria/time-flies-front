import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ErrorPage from "./error-page.tsx";
import LoginPage from "./pages/LoginPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'login',
                element: <LoginPage/>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
