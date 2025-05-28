# Documentação da API

## Autenticação

Todas as requisições que requerem autenticação devem incluir o header:
```
Authorization: Bearer <token>
```

### Endpoints de Autenticação

#### POST /api/auth/login
Login de usuário.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

## Candidatos

### GET /api/candidates
Lista todos os candidatos (requer autenticação de gestor).

**Query Parameters:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10)
- `search`: termo de busca

**Response (200):**
```json
{
  "data": [
    {
      "id": "number",
      "code": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "birthDate": "string",
      "address": {
        "zipCode": "string",
        "street": "string",
        "number": "string",
        "complement": "string",
        "neighborhood": "string",
        "city": "string",
        "state": "string"
      },
      "skills": [
        {
          "id": "number",
          "name": "string",
          "level": "string"
        }
      ],
      "educations": [
        {
          "id": "number",
          "institution": "string",
          "course": "string",
          "degree": "string",
          "startDate": "string",
          "endDate": "string"
        }
      ],
      "selectedForInterview": "boolean",
      "interviewDate": "string"
    }
  ],
  "meta": {
    "total": "number",
    "per_page": "number",
    "current_page": "number",
    "last_page": "number"
  }
}
```

### GET /api/candidates/:id
Obtém detalhes de um candidato específico.

**Response (200):**
```json
{
  "id": "number",
  "code": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "birthDate": "string",
  "address": {
    "zipCode": "string",
    "street": "string",
    "number": "string",
    "complement": "string",
    "neighborhood": "string",
    "city": "string",
    "state": "string"
  },
  "skills": [
    {
      "id": "number",
      "name": "string",
      "level": "string"
    }
  ],
  "educations": [
    {
      "id": "number",
      "institution": "string",
      "course": "string",
      "degree": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "selectedForInterview": "boolean",
  "interviewDate": "string"
}
```

### POST /api/candidates
Cria um novo candidato.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "birthDate": "string",
  "phone": "string",
  "zipCode": "string",
  "street": "string",
  "number": "string",
  "complement": "string",
  "neighborhood": "string",
  "city": "string",
  "state": "string",
  "skills": [
    {
      "name": "string",
      "level": "string"
    }
  ],
  "educations": [
    {
      "institution": "string",
      "course": "string",
      "degree": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ]
}
```

**Response (201):**
```json
{
  "id": "number",
  "code": "string",
  "name": "string",
  "email": "string"
}
```

### PUT /api/candidates/:id
Atualiza dados de um candidato.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "birthDate": "string",
  "phone": "string",
  "zipCode": "string",
  "street": "string",
  "number": "string",
  "complement": "string",
  "neighborhood": "string",
  "city": "string",
  "state": "string",
  "skills": [
    {
      "name": "string",
      "level": "string"
    }
  ],
  "educations": [
    {
      "institution": "string",
      "course": "string",
      "degree": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ]
}
```

**Response (200):**
```json
{
  "id": "number",
  "code": "string",
  "name": "string",
  "email": "string"
}
```

### POST /api/candidates/:id/interview
Seleciona um candidato para entrevista (requer autenticação de gestor).

**Request Body:**
```json
{
  "interviewDate": "string"
}
```

**Response (200):**
```json
{
  "id": "number",
  "selectedForInterview": "boolean",
  "interviewDate": "string"
}
```

## Códigos de Erro

- `400`: Bad Request - Dados inválidos
- `401`: Unauthorized - Não autenticado
- `403`: Forbidden - Sem permissão
- `404`: Not Found - Recurso não encontrado
- `422`: Unprocessable Entity - Erro de validação
- `500`: Internal Server Error - Erro interno do servidor

## Validação

Todos os endpoints que recebem dados validam os seguintes campos:

### Candidato
- `name`: obrigatório, mínimo 3 caracteres, máximo 100
- `email`: obrigatório, formato válido, único
- `password`: obrigatório, mínimo 8 caracteres
- `birthDate`: obrigatório, data válida anterior a hoje
- `phone`: obrigatório, formato brasileiro
- `zipCode`: obrigatório, 8 dígitos
- `street`: obrigatório, mínimo 3 caracteres
- `number`: obrigatório, mínimo 1 caractere
- `neighborhood`: obrigatório, mínimo 3 caracteres
- `city`: obrigatório, mínimo 3 caracteres
- `state`: obrigatório, 2 caracteres

### Habilidades
- `name`: obrigatório, mínimo 3 caracteres
- `level`: obrigatório, enum ['Básico', 'Intermediário', 'Avançado']

### Formação
- `institution`: obrigatório, mínimo 3 caracteres
- `course`: obrigatório, mínimo 3 caracteres
- `degree`: obrigatório, enum ['Graduação', 'Pós-graduação', 'Mestrado', 'Doutorado']
- `startDate`: obrigatório, data válida
- `endDate`: opcional, data válida posterior a startDate 