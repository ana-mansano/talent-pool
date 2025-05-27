import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FaPlus, FaTrash } from 'react-icons/fa'
import api from '../../services/api'

interface Skill {
  id: number
  name: string
}

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  const queryClient = useQueryClient()
  const [showSkillForm, setShowSkillForm] = useState(false)

  // Buscar habilidades disponíveis
  const { data: availableSkills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ['availableSkills'],
    queryFn: async () => {
      try {
        const response = await api.get('/skills')
        return response.data
      } catch (error) {
        console.error('Erro ao buscar habilidades:', error)
        return []
      }
    }
  })

  // Adicionar habilidade
  const addSkillMutation = useMutation({
    mutationFn: async (skillId: number) => {
      const response = await api.post('/candidates/skills', { skillId })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidateProfile'] })
      setShowSkillForm(false)
    }
  })

  // Remover habilidade
  const removeSkillMutation = useMutation({
    mutationFn: async (skillId: number) => {
      const response = await api.delete(`/candidates/skills/${skillId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidateProfile'] })
    }
  })

  return (
    <section style={{ 
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>Habilidades</h2>
        <button 
          onClick={() => setShowSkillForm(!showSkillForm)}
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
          <FaPlus /> Adicionar Habilidade
        </button>
      </div>

      {showSkillForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          {isLoadingSkills ? (
            <p style={{ color: 'var(--text-color-light)', marginTop: '0.5rem' }}>
              Carregando habilidades...
            </p>
          ) : (
            <select
              onChange={(e) => {
                const skillId = parseInt(e.target.value)
                if (skillId) {
                  addSkillMutation.mutate(skillId)
                }
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">Selecione uma habilidade</option>
              {Array.isArray(availableSkills) && availableSkills.map((skill: Skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {skills.map(skill => (
          <div key={skill.id} style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <span>{skill.name}</span>
            <button
              onClick={() => removeSkillMutation.mutate(skill.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
} 