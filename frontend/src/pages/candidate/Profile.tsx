import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import Navbar from '../../components/common/Navbar'
import PersonalData from '../../components/candidate/PersonalData'
import Education from '../../components/candidate/Education'
import Skills from '../../components/candidate/Skills'

interface Education {
  id: number
  candidate_id: number
  course_name: string
  institution_name: string
  completion_date: string
  created_at: string
  updated_at: string
}

interface Skill {
  id: number
  name: string
}

interface Candidate {
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
  selectedForInterview: boolean
  interviewDate?: string
  educations: Education[]
  skills: Skill[]
}

export default function Profile() {
  const userName = localStorage.getItem('userName') || 'Usuário'

  // Buscar perfil do candidato
  const { data: candidate, isLoading } = useQuery<Candidate>({
    queryKey: ['candidateProfile'],
    queryFn: async () => {
      const response = await api.get('/candidates/profile')
      return response.data
    }
  })

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar userName={userName} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar userName={userName} />
      <div style={{ 
        flex: 1,
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {candidate?.selectedForInterview && (
          <div style={{
            backgroundColor: 'var(--success-color)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3>Parabéns! Você foi selecionado para uma entrevista!</h3>
            <p>Data da entrevista: {new Date(candidate.interviewDate!).toLocaleDateString()} às 14:00</p>
          </div>
        )}

        <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Meu Perfil</h1>

        {candidate && (
          <>
            <PersonalData candidate={candidate} />
            <Education educations={candidate.educations} />
            <Skills skills={candidate.skills} />
          </>
        )}
      </div>
    </div>
  )
} 