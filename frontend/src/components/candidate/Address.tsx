import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import Notification from '../common/Notification'

interface AddressProps {
  candidate: {
    zip_code: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
  }
}

export default function Address({ candidate }: AddressProps) {
  const queryClient = useQueryClient()
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info')
  const [addressForm, setAddressForm] = useState({
    zipCode: '',
    number: '',
    complement: '',
    street: '',
    neighborhood: '',
    city: '',
    state: ''
  })

  // Preencher formulário quando o perfil for carregado
  useEffect(() => {
    if (candidate) {
      setAddressForm({
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
    setAddressForm(prev => ({ ...prev, zipCode }))
    
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
          setAddressForm(prev => ({
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

  // Atualizar endereço
  const updateAddressMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/candidates/profile', data)
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza o cache do React Query manualmente
      queryClient.setQueryData(['candidateProfile'], (oldData: any) => ({
        ...oldData,
        zip_code: addressForm.zipCode,
        number: addressForm.number,
        complement: addressForm.complement,
        street: addressForm.street,
        neighborhood: addressForm.neighborhood,
        city: addressForm.city,
        state: addressForm.state
      }))

      setNotificationMessage('Endereço atualizado com sucesso!')
      setNotificationType('success')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar:', error)
      setNotificationMessage(error.response?.data?.message || 'Erro ao atualizar endereço. Tente novamente.')
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
        }}>Endereço</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          updateAddressMutation.mutate(addressForm)
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>CEP</label>
              <input
                type="text"
                value={addressForm.zipCode}
                onChange={(e) => {
                  const zipCode = e.target.value.replace(/\D/g, '')
                  setAddressForm(prev => ({ ...prev, zipCode }))
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
                value={addressForm.street}
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
                value={addressForm.neighborhood}
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
                value={addressForm.city}
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
                value={addressForm.state}
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
                value={addressForm.number}
                onChange={(e) => setAddressForm(prev => ({ ...prev, number: e.target.value }))}
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
                value={addressForm.complement}
                onChange={(e) => setAddressForm(prev => ({ ...prev, complement: e.target.value }))}
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
            Salvar Endereço
          </button>
        </form>
      </section>
    </>
  )
} 