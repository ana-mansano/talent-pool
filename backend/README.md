# Backend do Portal de Talentos

API REST para o Portal de Talentos, desenvolvida com AdonisJS e TypeScript.

## Tecnologias

- AdonisJS v5
- TypeScript
- MySQL
- JWT
- Lucid ORM
- Validator
- Mail
- Redis (opcional)

## Estrutura de Diretórios

```
app/
├── Controllers/        # Controladores
├── Models/            # Modelos
├── Validators/        # Validadores
├── Middleware/        # Middlewares
├── Services/          # Serviços
├── Exceptions/        # Exceções personalizadas
└── Helpers/           # Funções auxiliares

config/                # Configurações
database/             # Migrations e seeds
start/                # Arquivos de inicialização
tests/                # Testes
```

## Modelos

### User
- `id`: number
- `name`: string
- `email`: string
- `password`: string
- `role`: enum ['candidate', 'manager']
- `created_at`: datetime
- `updated_at`: datetime

### Candidate
- `id`: number
- `user_id`: number
- `code`: string
- `birth_date`: date
- `phone`: string
- `zip_code`: string
- `street`: string
- `number`: string
- `complement`: string
- `neighborhood`: string
- `city`: string
- `state`: string
- `selected_for_interview`: boolean
- `interview_date`: datetime
- `created_at`: datetime
- `updated_at`: datetime

### Skill
- `id`: number
- `candidate_id`: number
- `name`: string
- `level`: enum ['Básico', 'Intermediário', 'Avançado']
- `created_at`: datetime
- `updated_at`: datetime

### Education
- `id`: number
- `candidate_id`: number
- `institution`: string
- `course`: string
- `degree`: enum ['Graduação', 'Pós-graduação', 'Mestrado', 'Doutorado']
- `start_date`: date
- `end_date`: date
- `created_at`: datetime
- `updated_at`: datetime

## Controladores

### AuthController
- `login`: Autenticação de usuário
- `logout`: Logout de usuário
- `me`: Informações do usuário logado

### CandidatesController
- `index`: Lista candidatos
- `store`: Cria candidato
- `show`: Mostra candidato
- `update`: Atualiza candidato
- `destroy`: Remove candidato
- `selectForInterview`: Seleciona para entrevista

### RecruitersController
- `listCandidates`: Lista candidatos (gestor)
- `showCandidate`: Mostra candidato (gestor)
- `selectForInterview`: Seleciona para entrevista

## Validadores

### CandidateValidator
- Validação de dados do candidato
- Regras para cada campo
- Mensagens de erro personalizadas

### InterviewValidator
- Validação de dados da entrevista
- Regras para data e hora
- Mensagens de erro personalizadas

## Middlewares

### Auth
- Verifica token JWT
- Define usuário na requisição
- Verifica permissões

### Role
- Verifica papel do usuário
- Restringe acesso por papel

## Serviços

### MailService
- Envio de emails
- Templates HTML
- Configuração SMTP

### StorageService
- Upload de arquivos
- Armazenamento local/S3
- Geração de URLs

## Exceções

### BusinessException
- Exceções de negócio
- Códigos de erro
- Mensagens personalizadas

### ValidationException
- Exceções de validação
- Erros de campos
- Mensagens de erro

## Helpers

### Format
- Formatação de datas
- Formatação de números
- Formatação de strings

### Validation
- Validação de CPF
- Validação de email
- Validação de telefone

## Configurações

### app.ts
- Configurações gerais
- Timezone
- Locale

### auth.ts
- Configuração JWT
- Expiração de token
- Chave secreta

### database.ts
- Conexão MySQL
- Pool de conexões
- Migrations

### mail.ts
- Configuração SMTP
- Templates
- Remetente padrão

## Migrations

### users
- Tabela de usuários
- Campos básicos
- Índices

### candidates
- Tabela de candidatos
- Campos de perfil
- Relacionamentos

### skills
- Tabela de habilidades
- Campos de nível
- Relacionamentos

### educations
- Tabela de formação
- Campos de curso
- Relacionamentos

## Seeds

### UserSeeder
- Usuários iniciais
- Papéis padrão
- Dados de teste

### CandidateSeeder
- Candidatos de teste
- Perfis completos
- Dados realistas

## Testes

### Unit
- Testes de modelos
- Testes de serviços
- Testes de helpers

### Integration
- Testes de controladores
- Testes de rotas
- Testes de middlewares

### E2E
- Testes de fluxos
- Testes de API
- Testes de autenticação

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute as migrations:
```bash
node ace migration:run
```

4. Execute os seeds:
```bash
node ace db:seed
```

5. Inicie o servidor:
```bash
npm run dev
```

## Comandos

### Desenvolvimento
```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Gera build de produção
npm run start      # Inicia servidor de produção
```

### Testes
```bash
npm test           # Executa todos os testes
npm run test:unit  # Executa testes unitários
npm run test:e2e   # Executa testes E2E
```

### Database
```bash
node ace migration:run    # Executa migrations
node ace migration:rollback # Reverte migrations
node ace db:seed         # Executa seeds
```

## Convenções

### Nomenclatura

- Controladores: PascalCase
- Modelos: PascalCase
- Validadores: PascalCase
- Middlewares: camelCase
- Serviços: PascalCase
- Helpers: camelCase
- Migrations: snake_case
- Seeds: PascalCase

### Imports

```typescript
// AdonisJS
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

// Modelos
import User from 'App/Models/User'
import Candidate from 'App/Models/Candidate'

// Serviços
import MailService from 'App/Services/MailService'

// Helpers
import { formatDate } from 'App/Helpers/format'
```

### Controladores

```typescript
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Controller {
  public async index({ request, response }: HttpContextContract) {
    // lógica
  }

  public async store({ request, response }: HttpContextContract) {
    // lógica
  }
}
```

### Modelos

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Model extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
```

## Boas Práticas

1. **Arquitetura**
   - MVC
   - SOLID
   - DRY

2. **Segurança**
   - Validação de dados
   - Sanitização de inputs
   - Headers de segurança

3. **Performance**
   - Índices no banco
   - Cache quando possível
   - Queries otimizadas

4. **Código Limpo**
   - Funções pequenas
   - Nomes descritivos
   - Comentários úteis

5. **TypeScript**
   - Tipos explícitos
   - Interfaces
   - Enums

6. **Testes**
   - Cobertura alta
   - Testes isolados
   - Mocks quando necessário

7. **Logs**
   - Logs estruturados
   - Níveis apropriados
   - Informações úteis

8. **Erros**
   - Tratamento adequado
   - Mensagens claras
   - Stack traces

9. **Documentação**
   - Comentários JSDoc
   - README atualizado
   - API documentada

10. **Versionamento**
    - Commits semânticos
    - Branches organizados
    - Pull requests 