import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/login', formData)
      console.log('Resposta do login:', response.data)
      
      const { token, role, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('userRole', role)
      localStorage.setItem('userName', user?.name || 'Usuário')

      navigate('/home', {
        state: {
          message: 'Login realizado com sucesso!',
          type: 'success'
        }
      })
    } catch (error) {
      setError('Email ou senha inválidos')
    }
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h1 className="text-center mb-4">Login</h1>

      {error && (
        <div className="mb-3" style={{ color: 'var(--danger-color)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Entrar
        </button>
      </form>

      <div className="text-center mt-3">
        <p>
          Não tem uma conta?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)' }}>
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login