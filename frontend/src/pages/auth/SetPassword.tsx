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
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

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

  const validatePassword = (password: string) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'password') {
      validatePassword(value)
    }
  }

  const isPasswordValid = () => {
    return Object.values(passwordRequirements).every(req => req)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isPasswordValid()) {
      setError('A senha não atende a todos os requisitos')
      return
    }

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
            <div className="password-requirements">
              <p>A senha deve conter:</p>
              <ul>
                <li className={passwordRequirements.length ? 'valid' : ''}>
                  Mínimo de 8 caracteres
                </li>
                <li className={passwordRequirements.uppercase ? 'valid' : ''}>
                  Pelo menos uma letra maiúscula
                </li>
                <li className={passwordRequirements.lowercase ? 'valid' : ''}>
                  Pelo menos uma letra minúscula
                </li>
                <li className={passwordRequirements.number ? 'valid' : ''}>
                  Pelo menos um número
                </li>
                <li className={passwordRequirements.special ? 'valid' : ''}>
                  Pelo menos um caractere especial
                </li>
              </ul>
            </div>
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

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!isPasswordValid()}
          >
            Definir Senha
          </button>
        </form>
      </div>
    </div>
  )
}