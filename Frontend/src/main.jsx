import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
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
import VerifyEmailRoute from './routeUtils/VerifyEmailRoute.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Channel from './pages/Channel.jsx'
import You from './pages/userPages/You.jsx'
import History from './pages/userPages/History.jsx'
import Liked from './pages/userPages/Liked.jsx'
import { QueryProvider } from './providers/QueryProvider.jsx'
import MyPlaylists from './pages/userPages/MyPlaylists.jsx'
import PlaylistDetails from './pages/userPages/PlaylistDetails.jsx'
import NotFound from './pages/NotFound.jsx'


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
      },
      {
        path: "channel/:username",
        element: <Channel/>
      },
      {
        path: "you",
        element: (
          <ProtectedRoute>
            <You/>
          </ProtectedRoute>
        )
      },
      {
        path:"history",
        element: (
          <ProtectedRoute>
            <History/>
          </ProtectedRoute>
        )
      },
      {
        path:"liked",
        element: (
          <ProtectedRoute>
            <Liked/>
          </ProtectedRoute>
        )
      },
      {
        path:"playlists",
        element:(
          <ProtectedRoute>
            <MyPlaylists/>
          </ProtectedRoute>
        )
      },
      {
        path:"playlist/:playlistId",
        element:(
          <ProtectedRoute>
            <PlaylistDetails/>
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
          <VerifyEmailRoute>
            <VerifyEmail/>
          </VerifyEmailRoute>
        )
      },
      {
        path: "forgot-password",
        element: (
          <GuestRoute>
            <ForgotPassword/>
          </GuestRoute>
        )
      },
      {
        path: "reset-password/:token",
        element: (
          <GuestRoute>
            <ResetPassword/>
          </GuestRoute>
        )
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])



createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </QueryProvider>
  </HelmetProvider>
)
