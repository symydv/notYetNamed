import { useAuth } from "./context/AuthContext"
import { Navigate } from "react-router-dom"

//this is used so that logged in users can not forcefully enter /login or /signup pages by entering url in browser.
export const GuestRoute = ({children})=>{
  const {user, loading} = useAuth()

  if(loading) return null;

  if(user){
    return <Navigate to="/" replace/>
  }

  return children
}