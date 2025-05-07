import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// This will prevent unauthenticated users from accessing this route

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  if (token !== null) return children
  else return <Navigate to="/" />
}

export default PrivateRoute
