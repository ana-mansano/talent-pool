import { DateTime } from 'luxon'

interface Education {
  id: number
  courseName: string
  institutionName: string
  completionDate: string | null
}

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
  educations: Education[]
}

interface CandidateDetailsModalProps {
  candidate: Candidate
  onClose: () => void
}

export default function CandidateDetailsModal({ candidate, onClose }: CandidateDetailsModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            color: 'var(--primary-color)',
            fontSize: '1.25rem'
          }}>
            Informações do Candidato
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-color-light)',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ 
            color: 'var(--primary-color)',
            marginBottom: '0.5rem',
            fontSize: '1.1rem'
          }}>
            {candidate.name}
          </h3>
          <p style={{ 
            color: 'var(--text-color-light)',
            fontSize: '0.875rem'
          }}>
            Código: {candidate.code}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Dados Básicos:</strong>
          <p>Email: {candidate.email}</p>
          <p>Telefone: {candidate.phone || 'Não informado'}</p>
          <p>Data de Nascimento: {candidate.birthDate ? new Date(candidate.birthDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Não informada'}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Endereço:</strong>
          {candidate.street ? (
            <>
              <p>{candidate.street}, {candidate.number}</p>
              {candidate.complement && <p>Complemento: {candidate.complement}</p>}
              <p>{candidate.neighborhood}</p>
              <p>{candidate.city} - {candidate.state}</p>
              <p>CEP: {candidate.zipCode}</p>
            </>
          ) : (
            <p style={{ 
              color: 'var(--text-color-light)',
              fontStyle: 'italic'
            }}>
              Endereço não informado
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Habilidades:</strong>
          {candidate.skills && candidate.skills.length > 0 ? (
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {candidate.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--primary-color-light)',
                    color: 'var(--primary-color)',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ 
              color: 'var(--text-color-light)',
              fontStyle: 'italic'
            }}>
              Sem habilidades cadastradas
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Formações:</strong>
          {candidate.educations && candidate.educations.length > 0 ? (
            <div>
              {candidate.educations.map((education, index) => (
                <div key={index} style={{ 
                  marginBottom: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: '4px'
                }}>
                  <p style={{ 
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--primary-color)'
                  }}>
                    {education.courseName}
                  </p>
                  <p style={{ 
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.875rem'
                  }}>
                    Instituição: {education.institutionName}
                  </p>
                  {education.completionDate && (
                    <p style={{ 
                      margin: '0',
                      fontSize: '0.875rem',
                      color: 'var(--text-color-light)'
                    }}>
                      Conclusão: {new Date(education.completionDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ 
              color: 'var(--text-color-light)',
              fontStyle: 'italic'
            }}>
              Sem formações cadastradas
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 