import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../components/common/Navbar'
import CandidateCard from '../../components/manager/CandidateCard'
import api from '../../services/api'

interface Candidate {
  id: number
  code: number
  name: string
  email: string
  phone: string | null
  birthDate: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  skills: string[]
  educations: {
    id: number
    courseName: string
    institutionName: string
    completionDate: string
  }[]
  selectedForInterview: boolean
  interviewDate: string | null
}

export default function CandidatesList() {
  const userName = localStorage.getItem('userName') || 'Gestor'
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: ['candidates', searchTerm],
    queryFn: async () => {
      const response = await api.get('/candidates')
      return response.data.map((candidate: any) => ({
        ...candidate,
        selectedForInterview: candidate.selectedForInterview || false
      }))
    }
  })

  // Filtragem no frontend
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCandidateSelect = () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  }

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
          Lista de Candidatos
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Buscar por nome, email ou habilidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              fontSize: '1rem'
            }}
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center' }}>Carregando...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {filteredCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onSelect={handleCandidateSelect}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 