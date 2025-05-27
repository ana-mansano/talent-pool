import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

interface NavbarProps {
  userName?: string
}

export default function Navbar({ userName }: NavbarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Talent Pool</h1>
      </div>
      <div className="navbar-content">
        {userName && (
          <span className="welcome-text">
            Olá, {userName}
          </span>
        )}
        <button onClick={handleLogout} className="btn-logout">
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  )
} 