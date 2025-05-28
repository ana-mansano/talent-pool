import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import CandidateDetailsModal from './CandidateDetailsModal'
import SelectForInterviewModal from './SelectForInterviewModal'

interface Candidate {
  id: number
  code: number
  name: string
  email: string
  phone: string | null
  birthDate: string | null
  zipCode: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  skills: string[]
  educations: {
    id: number
    courseName: string
    institutionName: string
    completionDate: string | null
  }[]
  selectedForInterview: boolean
  interviewDate: string | null
}

interface CandidateCardProps {
  candidate: Candidate
  onSelect: () => void
}

export default function CandidateCard({ candidate, onSelect }: CandidateCardProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSelecting, setIsSelecting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [error, setError] = useState('')

  const handleSelect = async () => {
    setShowModal(true)
  }

  const confirmSelection = async () => {
    try {
      setIsSelecting(true)
      setError('')
      
      const response = await api.post(`/candidates/${candidate.id}/interview`)
      
      // Atualiza o cache do React Query com a resposta da API
      queryClient.setQueryData(['candidates'], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData)) return oldData
        
        return oldData.map((c: any) => 
          c.id === candidate.id 
            ? { 
                ...c, 
                selectedForInterview: true,
                interviewDate: response.data.interviewDate
              }
            : c
        )
      })

      // Atualiza o estado local
      candidate.selectedForInterview = true
      candidate.interviewDate = response.data.interviewDate

      onSelect()
      setShowModal(false)
    } catch (error: any) {
      console.error('Erro ao selecionar candidato:', error)
      setError(error.response?.data?.message || 'Erro ao selecionar candidato. Tente novamente.')
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <>
      {/* Modal de Seleção */}
      {showModal && (
        <SelectForInterviewModal
          candidateName={candidate.name}
          onConfirm={confirmSelection}
          onCancel={() => setShowModal(false)}
          isSelecting={isSelecting}
          error={error}
        />
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && (
        <CandidateDetailsModal
          candidate={candidate}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Card do Candidato */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {candidate.selectedForInterview && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'var(--success-color)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '500',
            zIndex: 1
          }}>
            Selecionado
          </div>
        )}

        <div style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ 
            fontSize: '1.1rem',
            color: 'var(--text-color)',
            marginBottom: '0.25rem'
          }}>
            {candidate.name}
          </h3>
          <p style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-color-light)'
          }}>
            Código: {candidate.code}
          </p>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-color)'
          }}>
            {candidate.email}
          </p>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-color)'
          }}>
            {candidate.phone || 'Telefone não informado'}
          </p>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-color)'
          }}>
            {candidate.skills.slice(0, 3).join(', ')}
            {candidate.skills.length > 3 && '...'}
          </p>
        </div>

        <div style={{
          marginTop: 'auto',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setShowDetailsModal(true)}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
          >
            Ver mais
          </button>
          
          <button
            onClick={handleSelect}
            disabled={candidate.selectedForInterview || isSelecting}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: candidate.selectedForInterview ? 'var(--success-color)' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: candidate.selectedForInterview || isSelecting ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              opacity: candidate.selectedForInterview || isSelecting ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!candidate.selectedForInterview && !isSelecting) {
                e.currentTarget.style.backgroundColor = 'var(--primary-color-dark)'
              }
            }}
            onMouseOut={(e) => {
              if (!candidate.selectedForInterview && !isSelecting) {
                e.currentTarget.style.backgroundColor = 'var(--primary-color)'
              }
            }}
          >
            {candidate.selectedForInterview 
              ? 'Candidato já selecionado' 
              : isSelecting 
                ? 'Selecionando...' 
                : 'Selecionar para Entrevista'}
          </button>
        </div>
      </div>
    </>
  )
} 