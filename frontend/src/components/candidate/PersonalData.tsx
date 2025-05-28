import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import PersonalInfo from './PersonalInfo'
import Address from './Address'

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
  const navigate = useNavigate()

  return (
    <>
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
      <PersonalInfo candidate={candidate} />
      <Address candidate={candidate} />
    </>
  )
} 