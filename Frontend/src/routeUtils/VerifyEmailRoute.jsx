import React from 'react'
import {Navigate, useLocation } from 'react-router-dom'

function VerifyEmailRoute({children}) {
  const location = useLocation();
  if(!location.state?.email){
    return <Navigate to="/" replace />;
  }
  return children;
}

export default VerifyEmailRoute;