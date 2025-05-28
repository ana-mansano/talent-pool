# Frontend - Talent Pool

Interface web desenvolvida com React para gerenciamento de talentos.

## Tecnologias
- React
- TypeScript
- React Query
- Styled Components

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure o ambiente:
```bash
cp .env.example .env
```

3. Configure as variáveis no arquivo `.env`:
```
VITE_API_URL=http://localhost:3333/api
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Funcionalidades Principais

### Gestor
- Listagem de candidatos
- Busca por nome, email ou habilidades
- Seleção de candidatos para entrevista
- Visualização de detalhes do candidato

### Candidato
- Cadastro de perfil
- Adição de habilidades
- Atualização de dados pessoais
- Visualização de status da candidatura
