# Frontend do Portal de Talentos

Interface do usuário para o Portal de Talentos, desenvolvida com React e TypeScript.

## Tecnologias

- React 18
- TypeScript
- React Query
- Axios
- React Router
- Styled Components
- React Hook Form
- Yup
- Jest
- React Testing Library

## Estrutura de Diretórios

```
src/
├── components/         # Componentes reutilizáveis
│   ├── common/        # Componentes comuns (botões, inputs, etc)
│   ├── layout/        # Componentes de layout (header, sidebar, etc)
│   └── forms/         # Componentes de formulários
├── pages/             # Páginas da aplicação
├── services/          # Serviços de API
├── hooks/             # Custom hooks
├── contexts/          # Contextos React
├── utils/             # Funções utilitárias
├── styles/            # Estilos globais e temas
└── types/             # Definições de tipos TypeScript
```

## Componentes Principais

### Common

- `Button`: Botão reutilizável com variantes
- `Input`: Campo de entrada com validação
- `Select`: Campo de seleção
- `Modal`: Modal reutilizável
- `Feedback`: Componente de feedback (sucesso, erro, etc)
- `Loading`: Indicador de carregamento
- `Pagination`: Paginação de listas

### Layout

- `Header`: Cabeçalho da aplicação
- `Sidebar`: Menu lateral
- `Layout`: Layout principal
- `PageContainer`: Container de página

### Forms

- `CandidateForm`: Formulário de candidato
- `EducationForm`: Formulário de formação
- `SkillForm`: Formulário de habilidade
- `LoginForm`: Formulário de login

## Páginas

- `Login`: Página de login
- `Dashboard`: Dashboard principal
- `Candidates`: Listagem de candidatos
- `CandidateDetails`: Detalhes do candidato
- `Profile`: Perfil do usuário
- `Interviews`: Gerenciamento de entrevistas

## Serviços

- `api.ts`: Configuração do Axios
- `auth.ts`: Serviços de autenticação
- `candidates.ts`: Serviços de candidatos
- `interviews.ts`: Serviços de entrevistas

## Hooks

- `useAuth`: Hook de autenticação
- `useForm`: Hook de formulário
- `useToast`: Hook de notificações
- `usePagination`: Hook de paginação

## Contextos

- `AuthContext`: Contexto de autenticação
- `ThemeContext`: Contexto de tema
- `ToastContext`: Contexto de notificações

## Utils

- `validation.ts`: Funções de validação
- `format.ts`: Funções de formatação
- `storage.ts`: Funções de armazenamento local
- `api.ts`: Funções auxiliares da API

## Estilos

- `global.ts`: Estilos globais
- `theme.ts`: Tema da aplicação
- `variables.ts`: Variáveis CSS

## Tipos

- `candidate.ts`: Tipos relacionados a candidatos
- `user.ts`: Tipos relacionados a usuários
- `interview.ts`: Tipos relacionados a entrevistas
- `api.ts`: Tipos relacionados à API

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Testes

Execute os testes:
```bash
npm test
```

Execute os testes com cobertura:
```bash
npm test -- --coverage
```

## Build

Gere a build de produção:
```bash
npm run build
```

## Convenções

### Nomenclatura

- Componentes: PascalCase
- Funções: camelCase
- Variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Tipos/Interfaces: PascalCase
- Arquivos: kebab-case

### Imports

```typescript
// React e bibliotecas
import React from 'react'
import { useQuery } from 'react-query'

// Componentes
import { Button } from '@/components/common'
import { Header } from '@/components/layout'

// Hooks
import { useAuth } from '@/hooks'

// Utils
import { formatDate } from '@/utils'

// Tipos
import { Candidate } from '@/types'
```

### Componentes

```typescript
import React from 'react'
import styled from 'styled-components'

interface Props {
  title: string
  children: React.ReactNode
}

export const Component: React.FC<Props> = ({ title, children }) => {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  )
}

const Container = styled.div`
  // estilos
`

const Title = styled.h1`
  // estilos
`
```

### Hooks

```typescript
import { useState, useEffect } from 'react'

export const useCustomHook = () => {
  const [state, setState] = useState()

  useEffect(() => {
    // efeito
  }, [])

  return {
    state,
    setState
  }
}
```

## Boas Práticas

1. **Componentização**
   - Componentes pequenos e reutilizáveis
   - Separação de responsabilidades
   - Props tipadas

2. **Performance**
   - Memoização quando necessário
   - Lazy loading de componentes
   - Otimização de re-renders

3. **Acessibilidade**
   - ARIA labels
   - Navegação por teclado
   - Contraste adequado

4. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes de snapshot

5. **Código Limpo**
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)
   - SOLID

6. **TypeScript**
   - Tipos explícitos
   - Interfaces bem definidas
   - Evitar `any`

7. **Estilização**
   - CSS-in-JS
   - Temas
   - Responsividade

8. **Estado**
   - React Query para dados do servidor
   - Context API para estado global
   - useState para estado local

9. **Formulários**
   - React Hook Form
   - Validação com Yup
   - Feedback visual

10. **API**
    - Axios para requisições
    - Interceptors
    - Tratamento de erros
