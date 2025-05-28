import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaPlus, FaTrash } from 'react-icons/fa'
import api from '../../services/api'

interface Education {
  id: number
  candidate_id: number
  course_name: string
  institution_name: string
  completion_date: string
  created_at: string
  updated_at: string
}

interface EducationProps {
  educations: Education[]
}

export default function Education({ educations }: EducationProps) {
  const queryClient = useQueryClient()
  const [showEducationForm, setShowEducationForm] = useState(false)
  const [educationForm, setEducationForm] = useState({
    courseName: '',
    institutionName: '',
    completionDate: ''
  })

  // Função para formatar a data para o formato brasileiro
  const formatDate = (date: string) => {
    if (!date) return ''
    try {
      const dateObj = new Date(date)
      if (dateObj.toString() === 'Invalid Date') return ''
      return dateObj.toLocaleDateString('pt-BR')
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return ''
    }
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

  // Adicionar formação
  const addEducationMutation = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        course_name: data.courseName,
        institution_name: data.institutionName,
        completion_date: convertToISODate(data.completionDate)
      }
      const response = await api.post('/candidates/education', formattedData)
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza o cache do React Query manualmente
      queryClient.setQueryData(['candidateProfile'], (oldData: any) => ({
        ...oldData,
        educations: [...oldData.educations, data.education]
      }))
      setShowEducationForm(false)
      setEducationForm({ courseName: '', institutionName: '', completionDate: '' })
    }
  })

  // Remover formação
  const removeEducationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/candidates/education/${id}`)
      return response.data
    },
    onSuccess: (_, educationId) => {
      // Atualiza o cache do React Query manualmente
      queryClient.setQueryData(['candidateProfile'], (oldData: any) => ({
        ...oldData,
        educations: oldData.educations.filter((education: any) => education.id !== educationId)
      }))
    }
  })

  return (
    <section style={{ 
      marginBottom: '3rem',
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>Formações</h2>
        <button 
          onClick={() => setShowEducationForm(!showEducationForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color-dark)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
        >
          <FaPlus /> Adicionar Formação
        </button>
      </div>

      {showEducationForm && (
        <form onSubmit={(e) => {
          e.preventDefault()
          if (!isValidDate(educationForm.completionDate)) {
            alert('Data inválida')
            return
          }
          if (!isNotFutureDate(educationForm.completionDate)) {
            alert('A data não pode ser posterior ao dia de hoje')
            return
          }
          addEducationMutation.mutate(educationForm)
        }} style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Curso</label>
              <input
                type="text"
                value={educationForm.courseName}
                onChange={(e) => setEducationForm(prev => ({ ...prev, courseName: e.target.value }))}
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
              <label style={{ fontWeight: '500' }}>Instituição</label>
              <input
                type="text"
                value={educationForm.institutionName}
                onChange={(e) => setEducationForm(prev => ({ ...prev, institutionName: e.target.value }))}
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
              <label style={{ fontWeight: '500' }}>Data de Conclusão</label>
              <input
                type="text"
                value={educationForm.completionDate}
                onChange={(e) => {
                  const formattedDate = formatDateWhileTyping(e.target.value)
                  setEducationForm(prev => ({ ...prev, completionDate: formattedDate }))
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
            Adicionar
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {educations.map(education => {
          const completionDate = education.completion_date 
            ? formatDate(education.completion_date)
            : 'Não informada'

          return (
            <div key={education.id} style={{
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--background-color)'
            }}>
              <div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{education.course_name}</h3>
                <p style={{ marginBottom: '0.25rem' }}>{education.institution_name}</p>
                <p style={{ color: 'var(--text-color-light)' }}>
                  Conclusão: {completionDate}
                </p>
              </div>
              <button 
                onClick={() => removeEducationMutation.mutate(education.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--error-color)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--error-color-dark)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--error-color)'}
              >
                <FaTrash />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
} 