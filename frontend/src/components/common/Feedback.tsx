import React from 'react'

interface FeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose?: () => void
}

export default function Feedback({ type, message, onClose }: FeedbackProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return ''
    }
  }

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'var(--success-color)'
      case 'error':
        return 'var(--danger-color)'
      case 'warning':
        return 'var(--warning-color)'
      case 'info':
        return 'var(--info-color)'
      default:
        return 'var(--text-color)'
    }
  }

  return (
    <div
      style={{
        padding: '1rem',
        margin: '1rem 0',
        borderRadius: '4px',
        backgroundColor: `${getColor()}10`,
        border: `1px solid ${getColor()}`,
        color: getColor(),
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{getIcon()}</span>
      <p style={{ margin: 0, flex: 1 }}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: getColor(),
            cursor: 'pointer',
            padding: '0.25rem',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      )}
    </div>
  )
} 