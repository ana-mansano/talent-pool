# Portal de Talentos

Sistema de gerenciamento de talentos para empresas, permitindo o cadastro de candidatos e seleção para entrevistas.

## Tecnologias Utilizadas

### Backend
- AdonisJS v5
- MySQL
- TypeScript
- JWT para autenticação
- Validação de dados
- Logging de segurança
- Headers de segurança

### Frontend
- ReactJS
- TypeScript
- React Query para gerenciamento de estado
- Axios para requisições HTTP
- Componentes reutilizáveis
- Feedback visual para o usuário
- Validação de formulários

## Funcionalidades

- Cadastro de candidatos com dados pessoais, formação e habilidades
- Preenchimento automático de endereço via CEP
- Autenticação de usuários (candidatos e gestores)
- Listagem e busca de candidatos
- Seleção de candidatos para entrevista
- Notificações por email
- Interface responsiva

## Requisitos

- Node.js 14+
- MySQL 8+
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/portal-talentos.git
cd portal-talentos
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Configure o banco de dados:
- Crie um banco MySQL
- Copie o arquivo `.env.example` para `.env`
- Configure as variáveis de ambiente no arquivo `.env`

4. Execute as migrations:
```bash
node ace migration:run
```

5. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

## Executando o Projeto

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Inicie o frontend:
```bash
cd frontend
npm start
```

O backend estará disponível em `http://localhost:3333` e o frontend em `http://localhost:3000`.

## Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Segurança

O projeto implementa várias camadas de segurança:

- Autenticação JWT com expiração
- Validação de dados
- Sanitização de inputs
- Headers de segurança
- Rate limiting
- Logging de segurança
- Proteção contra XSS e CSRF

## Estrutura do Projeto

```
portal-talentos/
├── backend/
│   ├── app/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Validators/
│   │   └── Middleware/
│   ├── database/
│   │   └── migrations/
│   └── tests/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── styles/
    └── tests/
```