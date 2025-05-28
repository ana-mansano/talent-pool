import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../components/common/Navbar'
import api from '../../services/api'

export default function CandidateDetails() {
  const { id } = useParams()
  const userName = localStorage.getItem('userName') || 'Gestor'

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const response = await api.get(`/api/candidates/${id}`)
      return response.data
    }
  })

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <Navbar userName={userName} />
      <main style={{ padding: '2rem', marginTop: '4rem' }}>
        <h1>Detalhes do Candidato</h1>
        {candidate && (
          <div>
            <h2>{candidate.name}</h2>
            <p>{candidate.email}</p>
            {/* Adicione mais detalhes conforme necessário */}
          </div>
        )}
      </main>
    </div>
  )
} 