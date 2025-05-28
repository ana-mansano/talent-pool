interface SelectForInterviewModalProps {
  candidateName: string
  onConfirm: () => void
  onCancel: () => void
  isSelecting: boolean
  error?: string
}

export default function SelectForInterviewModal({ 
  candidateName, 
  onConfirm, 
  onCancel, 
  isSelecting,
  error 
}: SelectForInterviewModalProps) {
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
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: 'var(--primary-color)',
          marginBottom: '1rem',
          fontSize: '1.5rem'
        }}>
          Confirmar Seleção
        </h2>
        
        <p style={{ marginBottom: '1.5rem' }}>
          Você está selecionando <strong>{candidateName}</strong> para uma entrevista.
          Um email será enviado automaticamente com os detalhes.
        </p>

        {error && (
          <p style={{ 
            color: 'var(--error-color)',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: 'var(--error-color-light)',
            borderRadius: '4px'
          }}>
            {error}
          </p>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isSelecting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSelecting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: isSelecting ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !isSelecting && (e.currentTarget.style.backgroundColor = 'var(--primary-color-dark)')}
            onMouseOut={(e) => !isSelecting && (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
          >
            {isSelecting ? 'Selecionando...' : 'Confirmar Seleção'}
          </button>
        </div>
      </div>
    </div>
  )
} 