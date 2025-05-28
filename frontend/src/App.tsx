import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import './styles/global.css'

// Páginas
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import SetPassword from './pages/auth/SetPassword'
import Home from './pages/Home'
import Profile from './pages/candidate/Profile'
import CandidatesList from './pages/manager/CandidatesList'
import CandidateDetails from './pages/manager/CandidateDetails'

// Componentes
import Notification from './components/common/Notification'
import PrivateRoute from './components/auth/PrivateRoute'

const queryClient = new QueryClient()

function App() {
  const userRole = localStorage.getItem('userRole')

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="container">
            <Notification />
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<SetPassword />} />

              {/* Rotas protegidas */}
              <Route path="/" element={
                <PrivateRoute>
                  {userRole === 'manager' ? (
                    <Navigate to="/candidates" replace />
                  ) : (
                    <Home />
                  )}
                </PrivateRoute>
              } />

              {/* Rotas de candidato */}
              <Route path="/profile" element={
                <PrivateRoute>
                  {userRole === 'manager' ? (
                    <Navigate to="/candidates" replace />
                  ) : (
                    <Profile />
                  )}
                </PrivateRoute>
              } />

              {/* Rotas de gestor */}
              <Route path="/candidates" element={
                <PrivateRoute>
                  {userRole === 'manager' ? (
                    <CandidatesList />
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </PrivateRoute>
              } />
              <Route path="/candidates/:id" element={
                <PrivateRoute>
                  {userRole === 'manager' ? (
                    <CandidateDetails />
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </PrivateRoute>
              } />

              {/* Rota padrão - redireciona para login se não autenticado */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App