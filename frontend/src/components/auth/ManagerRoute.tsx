import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ManagerRouteProps {
  children: ReactNode
}

export default function ManagerRoute({ children }: ManagerRouteProps) {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (!token || userRole !== 'manager') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 