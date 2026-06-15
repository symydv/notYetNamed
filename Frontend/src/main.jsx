import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import { Player } from './pages/Player.jsx'
import { Login } from './pages/auth/Login.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Signup } from './pages/auth/Signup.jsx'
import { AuthLayout } from './AuthLayout.jsx'
import { GuestRoute } from './routeUtils/GuestRoute.jsx'
import { Upload } from './pages/Upload.jsx'
import ProtectedRoute from './routeUtils/ProtectedRoute.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "",
        element: <Home/> 
      },
      {
        path: "player/:videoId",
        element: <Player/>
      },
      {
        path: "upload",
        element: (
          <ProtectedRoute>
            <Upload/>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/",              //we have put these separately under authlayout because we dont want header on them.
    element: <AuthLayout/>,
    children: [
      {
        path: "login", //wraped inside guest route to protect it from logged in users.
        element: (
          <GuestRoute> 
            <Login/>
          </GuestRoute>
        ) 
      },
      {
        path: "signup",
        element: (
          <GuestRoute> 
            <Signup/>
          </GuestRoute>
        ) 
      },
      {
        path: "verify-email",
        element: (
          <VerifyEmail/>
        )
      }
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>,
)
