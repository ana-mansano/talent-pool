import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

export default function SetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: ''
  })
  const [error, setError] = useState('')

  const token = new URLSearchParams(location.search).get('token')

  useEffect(() => {
    if (!token) {
      navigate('/login', {
        state: {
          message: 'Token inválido ou expirado',
          type: 'error'
        }
      })
    }
  }, [token, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas não coincidem')
      return
    }

    try {
      await axios.post('http://localhost:3333/api/verify-email', {
        token,
        password: formData.password
      })

      navigate('/login', {
        state: {
          message: 'Senha definida com sucesso! Faça login para continuar.',
          type: 'success'
        }
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao definir senha')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Definir Nova Senha</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Nova Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirmar Senha</label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Definir Senha
          </button>
        </form>
      </div>
    </div>
  )
}