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
}

export default function CandidatesList() {
  const userName = localStorage.getItem('userName') || 'Gestor'
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
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

  // Paginação no frontend
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCandidateSelect = () => {
    // Força uma nova busca dos dados
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
    queryClient.refetchQueries({ 
      queryKey: ['candidates'],
      exact: true,
      type: 'active'
    })
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
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
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
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {paginatedCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onSelect={handleCandidateSelect}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  Anterior
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (page === 1 || page === totalPages) return true
                      if (Math.abs(page - currentPage) <= 1) return true
                      return false
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && array[index - 1] !== page - 1
                      return (
                        <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {showEllipsis && (
                            <span style={{ color: 'var(--text-color)' }}>...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--primary-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: page === currentPage ? 'bold' : 'normal',
                              boxShadow: page === currentPage ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                              transform: page === currentPage ? 'scale(1.05)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {page}
                          </button>
                        </div>
                      )
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'default' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
} 