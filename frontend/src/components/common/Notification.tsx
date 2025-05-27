import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface NotificationProps {
  message?: string
  type?: 'success' | 'error' | 'info'
  onClose?: () => void
}

export default function Notification({ message, type = 'info', onClose }: NotificationProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [localMessage, setLocalMessage] = useState(message || location.state?.message)
  const [localType, setLocalType] = useState(location.state?.type || type || 'info')

  useEffect(() => {
    if (location.state?.message) {
      setLocalMessage(location.state.message)
      setLocalType(location.state.type || 'info')
      
      const timer = setTimeout(() => {
        window.history.replaceState({}, document.title)
        setLocalMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [location.state])

  if (!localMessage && !message) return null

  const displayMessage = message || localMessage
  const displayType = localType || type || 'info'

  const getBackgroundColor = () => {
    switch (displayType) {
      case 'success':
        return 'var(--success-color)'
      case 'error':
        return 'var(--danger-color)'
      default:
        return 'var(--info-color)'
    }
  }

  const backgroundColor = getBackgroundColor()

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      navigate(location.pathname, { replace: true, state: {} })
      setLocalMessage(null)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: backgroundColor,
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 2000,
        minWidth: '300px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <span>{displayMessage}</span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          marginLeft: '1rem',
          fontSize: '1.2rem',
          padding: '0.25rem 0.5rem'
        }}
      >
        ×
      </button>
    </div>
  )
}