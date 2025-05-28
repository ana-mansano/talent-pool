import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--primary-color)',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem' 
      }}>
        <span style={{ 
          color: 'white',
          fontWeight: '500',
          fontSize: '1.1rem'
        }}>
          Olá, {userName}
        </span>
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: 'white',
          border: '1px solid white',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <FaSignOutAlt /> Sair
      </button>
    </nav>
  )
} 