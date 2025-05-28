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