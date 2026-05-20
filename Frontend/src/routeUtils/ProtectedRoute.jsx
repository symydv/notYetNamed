//to only allow logged in users to visit such routes.
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {

  const  {user, loading} = useAuth(); 
  
  if(loading){
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    )
  }

  if(!user){
    return <Navigate to={'/'} replace/>
  }
  return children
}

export default ProtectedRoute