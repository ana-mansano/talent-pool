# Backend - Talent Pool

API REST desenvolvida com AdonisJS para gerenciamento de talentos.

## Tecnologias
- AdonisJS
- TypeScript
- PostgreSQL
- JWT para autenticação

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
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=chave-secreta
DRIVE_DISK=local
DB_CONNECTION=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=talent_pool
```

4. Execute as migrations:
```bash
node ace migration:run
```

5. Execute os seeds:
```bash
node ace db:seed
```

6. Inicie o servidor:
```bash
npm run dev
```

## Documentação da API

### Autenticação

#### Registro de Usuário
```http
POST /api/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@exemplo.com",
}
```

**Regras de Validação da Senha:**
- Mínimo de 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número
- Pelo menos um caractere especial

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "joao.silva@exemplo.com",
  "password": "senha123"
}
```

#### Verificação de Email
```http
POST /api/verify-email
Content-Type: application/json

{
  "token": "token-de-verificacao",
  "password": "senha123"
}
```

**Regras de Validação da Senha:**
- Mínimo de 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número
- Pelo menos um caractere especial

### Candidatos

#### Criar Perfil
```http
POST /api/candidates
Authorization: Bearer {token}
Content-Type: application/json

{
  "birthDate": "1990-01-01",
  "phone": "11999999999",
  "zipCode": "12345678"
}
```

#### Adicionar Habilidade
```http
POST /api/candidates/skills
Authorization: Bearer {token}
Content-Type: application/json

{
  "skillId": 1
}
```

#### Listar Habilidades
```http
GET /api/candidates/skills
Authorization: Bearer {token}
```

#### Adicionar Formação
```http
POST /api/candidates/education
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseName": "Ciência da Computação",
  "institutionName": "Universidade XYZ",
  "completionDate": "2023-12-31"
}
```

### Gestor

#### Listar Candidatos
```http
GET /api/candidates
Authorization: Bearer {token}
```

#### Selecionar para Entrevista
```http
POST /api/candidates/:id/interview
Authorization: Bearer {token}
```

## Rotas Principais

### Autenticação
- POST `/api/register` - Registro de usuário
- POST `/api/login` - Login
- POST `/api/logout` - Logout

### Candidatos
- GET `/api/candidates` - Lista candidatos
- GET `/api/candidates/:id` - Detalhes do candidato
- POST `/api/candidates/:id/interview` - Seleciona candidato para entrevista

### Perfil do Candidato
- GET `/api/candidates/profile` - Obtém perfil
- PUT `/api/candidates/profile` - Atualiza perfil
- POST `/api/candidates/skills` - Adiciona habilidade
- DELETE `/api/candidates/skills/:id` - Remove habilidade 
