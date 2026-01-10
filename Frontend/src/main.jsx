import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Home } from './components/Home.jsx'
import { Player } from './components/Player.jsx'
import { Login } from './components/auth/Login.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Signup } from './components/auth/Signup.jsx'
import { AuthLayout } from './AuthLayout.jsx'
import { GuestRoute } from './GuestRoute.jsx'


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
      }
    ]
  },
  {
    path: "/",              //we have put these two separately under authlayout because we dont want header on these two.
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
      }
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>,
)
