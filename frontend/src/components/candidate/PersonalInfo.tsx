import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import Notification from '../common/Notification'

interface PersonalInfoProps {
  candidate: {
    birth_date: string
    phone: string
  }
}

export default function PersonalInfo({ candidate }: PersonalInfoProps) {
  const queryClient = useQueryClient()
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info')
  const [personalForm, setPersonalForm] = useState({
    birthDate: '',
    phone: ''
  })

  // Função para formatar o telefone
  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '')
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  // Função para remover a formatação do telefone
  const unformatPhone = (phone: string) => {
    return phone.replace(/\D/g, '')
  }

  // Função para formatar a data para o formato brasileiro
  const formatDate = (date: string) => {
    if (!date) return ''
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  // Função para converter data do formato brasileiro para ISO
  const convertToISODate = (date: string) => {
    if (!date) return ''
    const [day, month, year] = date.split('/')
    return `${year}-${month}-${day}`
  }

  // Função para validar o formato da data
  const isValidDateFormat = (date: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/
    return regex.test(date)
  }

  // Função para validar se a data é válida
  const isValidDate = (date: string) => {
    if (!isValidDateFormat(date)) return false
    const [day, month, year] = date.split('/')
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return dateObj.toString() !== 'Invalid Date'
  }

  // Função para validar se a data não é futura
  const isNotFutureDate = (date: string) => {
    if (!isValidDate(date)) return true
    const [day, month, year] = date.split('/')
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dateObj <= today
  }

  // Função para formatar a data enquanto digita
  const formatDateWhileTyping = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
    }
  }

  // Preencher formulário quando o perfil for carregado
  useEffect(() => {
    if (candidate) {
      // Formata a data de nascimento
      const birthDate = candidate.birth_date 
        ? formatDate(new Date(candidate.birth_date).toISOString().split('T')[0])
        : ''

      // Formata o telefone
      const phone = candidate.phone 
        ? formatPhone(candidate.phone)
        : ''

      // Atualiza o estado do formulário
      setPersonalForm({
        birthDate,
        phone
      })
    }
  }, [candidate])

  // Atualizar dados pessoais
  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: any) => {
      // Garante que a data está no formato ISO correto
      const birthDate = convertToISODate(data.birthDate)
      if (!birthDate) {
        throw new Error('Data inválida')
      }

      const formattedData = {
        birthDate,
        phone: unformatPhone(data.phone)
      }
      const response = await api.put('/candidates/profile', formattedData)
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza o cache do React Query manualmente
      queryClient.setQueryData(['candidateProfile'], (oldData: any) => ({
        ...oldData,
        birth_date: data.candidate.birthDate,
        phone: data.candidate.phone
      }))

      setNotificationMessage('Dados atualizados com sucesso!')
      setNotificationType('success')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar:', error)
      setNotificationMessage(error.response?.data?.message || 'Erro ao atualizar dados. Tente novamente.')
      setNotificationType('error')
    }
  })

  return (
    <>
      <Notification 
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationMessage('')}
      />
      <section style={{ 
        marginBottom: '3rem',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: 'var(--primary-color)',
          marginBottom: '1.5rem'
        }}>Dados Pessoais</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          if (!isValidDate(personalForm.birthDate)) {
            setNotificationMessage('Data inválida')
            setNotificationType('error')
            return
          }
          if (!isNotFutureDate(personalForm.birthDate)) {
            setNotificationMessage('A data não pode ser posterior ao dia de hoje')
            setNotificationType('error')
            return
          }
          updatePersonalInfoMutation.mutate(personalForm)
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Data de Nascimento</label>
              <input
                type="text"
                value={personalForm.birthDate}
                onChange={(e) => {
                  const formattedDate = formatDateWhileTyping(e.target.value)
                  setPersonalForm(prev => ({ ...prev, birthDate: formattedDate }))
                }}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Telefone</label>
              <input
                type="tel"
                value={personalForm.phone}
                onChange={(e) => {
                  const formattedPhone = formatPhone(e.target.value)
                  setPersonalForm(prev => ({ ...prev, phone: formattedPhone }))
                }}
                maxLength={15}
                placeholder="(XX) XXXXX-XXXX"
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          <button 
            type="submit" 
            style={{ 
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color-dark)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
          >
            Salvar Dados Pessoais
          </button>
        </form>
      </section>
    </>
  )
} 