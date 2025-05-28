import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function Home() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'Usuário'
  const userRole = localStorage.getItem('userRole') || 'candidate'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar userName={userName} />
      <main style={{ 
        flex: 1,
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        marginTop: '4rem'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '500',
          color: 'var(--primary-color)',
          margin: '3rem 0',
          fontFamily: 'var(--font-family)',
          letterSpacing: '0.5px'
        }}>
          Bem-vindo(a), {userName}!
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {userRole === 'manager' ? (
            <div style={{
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              textAlign: 'center'
            }}
            onClick={() => navigate('/candidates')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Meus Candidatos</h2>
              <p>Visualize e gerencie os candidatos cadastrados</p>
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              textAlign: 'center'
            }}
            onClick={() => navigate('/profile')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Meu Perfil</h2>
              <p>Gerencie suas informações pessoais, formações e habilidades</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}