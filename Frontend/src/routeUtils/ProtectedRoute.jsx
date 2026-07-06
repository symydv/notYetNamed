//to only allow logged in users to visit such routes.
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
function ProtectedRoute({children}) {

  const  {user, loading} = useAuth(); 
  
  if(loading){
    return (
      <LoadingSpinner/>
    )
  }

  if(!user){
    return <Navigate to={'/'} replace/>
  }
  return children
}

export default ProtectedRoute