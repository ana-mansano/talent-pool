import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import api from '../../services/api'
import Notification from '../common/Notification'

interface PersonalDataProps {
  candidate: {
    id: number
    birth_date: string
    phone: string
    zip_code: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
}

export default function PersonalData({ candidate }: PersonalDataProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info')
  const [profileForm, setProfileForm] = useState({
    birthDate: '',
    phone: '',
    zipCode: '',
    number: '',
    complement: '',
    street: '',
    neighborhood: '',
    city: '',
    state: ''
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
      setProfileForm({
        birthDate,
        phone,
        zipCode: candidate.zip_code || '',
        number: candidate.number || '',
        complement: candidate.complement || '',
        street: candidate.street || '',
        neighborhood: candidate.neighborhood || '',
        city: candidate.city || '',
        state: candidate.state || ''
      })
    }
  }, [candidate])

  // Buscar endereço pelo CEP
  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.replace(/\D/g, '')
    setProfileForm(prev => ({ ...prev, zipCode }))
    
    if (zipCode.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          // Atualiza o cache do React Query com os novos dados do endereço
          queryClient.setQueryData(['candidateProfile'], (oldData: any) => ({
            ...oldData,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
            zip_code: zipCode
          }))

          // Atualiza o formulário com os dados do CEP
          setProfileForm(prev => ({
            ...prev,
            zipCode,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }))
        } else {
          setNotificationMessage('CEP inválido')
          setNotificationType('error')
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        setNotificationMessage('Erro ao buscar CEP')
        setNotificationType('error')
      }
    }
  }

  // Atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // Remove a formatação do telefone antes de enviar
      const formattedData = {
        ...data,
        phone: unformatPhone(data.phone),
        birthDate: convertToISODate(data.birthDate),
        zipCode: data.zipCode,
        number: data.number,
        complement: data.complement || '',
        street: data.street || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        state: data.state || ''
      }
      console.log('Dados enviados:', formattedData)
      const response = await api.put('/candidates/profile', formattedData)
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza o cache do React Query manualmente
      queryClient.setQueryData(['candidateProfile'], (oldData: any) => ({
        ...oldData,
        birth_date: convertToISODate(profileForm.birthDate),
        phone: unformatPhone(profileForm.phone),
        zip_code: profileForm.zipCode,
        number: profileForm.number,
        complement: profileForm.complement,
        street: profileForm.street,
        neighborhood: profileForm.neighborhood,
        city: profileForm.city,
        state: profileForm.state,
        skills: data.candidate.skills || oldData.skills,
        educations: data.candidate.educations || oldData.educations
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

  // Função para atualizar o formulário
  const updateForm = (field: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ color: 'var(--primary-color)' }}>Dados Pessoais</h2>
          <button
            onClick={() => navigate('/', { replace: true })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
            <FaArrowLeft /> Voltar
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault()
          if (!isValidDate(profileForm.birthDate)) {
            setNotificationMessage('Data inválida')
            setNotificationType('error')
            return
          }
          if (!isNotFutureDate(profileForm.birthDate)) {
            setNotificationMessage('A data não pode ser posterior ao dia de hoje')
            setNotificationType('error')
            return
          }
          const dataToSubmit = {
            ...profileForm,
            street: candidate?.street || '',
            neighborhood: candidate?.neighborhood || '',
            city: candidate?.city || '',
            state: candidate?.state || ''
          }
          updateProfileMutation.mutate(dataToSubmit)
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
                value={profileForm.birthDate}
                onChange={(e) => {
                  const formattedDate = formatDateWhileTyping(e.target.value)
                  updateForm('birthDate', formattedDate)
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
                value={profileForm.phone}
                onChange={(e) => {
                  const formattedPhone = formatPhone(e.target.value)
                  updateForm('phone', formattedPhone)
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>CEP</label>
              <input
                type="text"
                value={profileForm.zipCode}
                onChange={(e) => {
                  const zipCode = e.target.value.replace(/\D/g, '')
                  updateForm('zipCode', zipCode)
                  if (zipCode.length === 8) {
                    handleZipCodeChange(e)
                  }
                }}
                maxLength={8}
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
              <label style={{ fontWeight: '500' }}>Rua</label>
              <input
                type="text"
                value={candidate?.street || ''}
                readOnly
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem',
                  backgroundColor: 'var(--background-color)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Bairro</label>
              <input
                type="text"
                value={candidate?.neighborhood || ''}
                readOnly
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem',
                  backgroundColor: 'var(--background-color)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Cidade</label>
              <input
                type="text"
                value={candidate?.city || ''}
                readOnly
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem',
                  backgroundColor: 'var(--background-color)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Estado</label>
              <input
                type="text"
                value={candidate?.state || ''}
                readOnly
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  fontSize: '1rem',
                  backgroundColor: 'var(--background-color)'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Número</label>
              <input
                type="text"
                value={profileForm.number}
                onChange={(e) => setProfileForm(prev => ({ ...prev, number: e.target.value }))}
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
              <label style={{ fontWeight: '500' }}>Complemento</label>
              <input
                type="text"
                value={profileForm.complement}
                onChange={(e) => setProfileForm(prev => ({ ...prev, complement: e.target.value }))}
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
            Salvar Dados
          </button>
        </form>
      </section>
    </>
  )
} 