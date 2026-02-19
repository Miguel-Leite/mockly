# Mockly - Documentação do Projeto

## Objetivo do Projeto

**Mockly** é uma ferramenta para gerar APIs simuladas localmente, permitindo que desenvolvedores de front-end trabalhem sem depender do backend.

- **Slogan**: "Mock APIs rapidinho, desenvolva sem esperar o backend"
- **Propósito**: Criar um ambiente de desenvolvimento onde frontend developers podem prototipar e testar suas aplicações sem depender do backend

---

## Regra de Negócio

### Princípios Fundamentais

1. **Servidor é o Core**
   - O servidor é o núcleo do sistema
   - Deve iniciar sempre primeiro
   - Nunca depende do Front Web

2. **Front Web é Apenas Visual**
   - Interface para gerenciar endpoints
   - Consome o servidor via API REST
   - **Não inicializa o servidor**

3. **CLI é o Orquestrador**
   - Controla a inicialização do servidor e front web
   - Comando único para iniciar tudo
   - `npx mockly start`

### Fluxo de Uso

```
Dev → npx mockly start → Servidor (porta 3001) + Front Web (porta 5173) + Browser
```

---

## Arquitetura do Projeto

```
Mockly (Monorepo)
├── packages/
│   ├── server/    → Core - cria e responde endpoints mock
│   ├── web/      → Interface visual - painel de gestão
│   ├── cli/      → Orquestrador - controla inicialização
│   └── hooks/    → React hooks - consumo em apps React
```

| Módulo | Responsabilidade | Dependência |
|--------|-----------------|--------------|
| **Server** | Criar/responder endpoints mock | Nenhuma (independente) |
| **Web** | UI para gerenciar endpoints | Consome Server via API |
| **CLI** | Orquestrar start do server e web | Coordena ambos |
| **Hooks** | React hooks para consumo | TanStack Query + Axios |

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Servidor | Node.js + Express + TypeScript |
| Front Web | React + Vite + Tailwind CSS v3 + Shadcn UI |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| CLI | Commander.js + Node.js |
| Hooks | React + TanStack Query v5 + Axios |
| Testes | Jest |
| Pacote NPM | TypeScript (build) |
| Documentação | Storybook v8 |

---

## Design System

### Cores

| Propósito | Cor | Hex |
|-----------|-----|-----|
| **Primary** | Green 600 | `#16a34a` |
| **Background** | Neutral 950 | `#0a0a0a` |
| **Surface** | Neutral 900 | `#171717` |
| **Border** | Neutral 800 | `#262626` |
| **Text Primary** | Neutral 100 | |
| **Text Secondary** | Neutral 400 | |
| **Error** | Red 400 | |
| **Success** | Green 500 | |

### Estilo

- **Dark mode**: Por padrão
- **Font-size**: sm (pequeno)
- **Cards**: Compactos
- **UI**: Limpa, leve, suave
- **Icons**: Lucide React
- **Componentes**: Shadcn UI com Radix primitives

---

## Comandos CLI

| Comando | Descrição |
|---------|-----------|
| `npx mockly start` | Inicia servidor + front web + abre browser |
| `npx mockly start --no-open` | Inicia sem abrir browser |
| `npx mockly start -p 4000` | Porta customizada do servidor |
| `npx mockly start -w 3000` | Porta customizada do web |
| `npx mockly server` | Inicia apenas o servidor |
| `npx mockly server -p 4000` | Porta customizada |
| `npx mockly web` | Inicia apenas o front web |
| `npx mockly web -p 3000` | Porta customizada |
| `npm run storybook` | Inicia Storybook (desenvolvimento) |
| `npm run build-storybook` | Build Storybook estático |

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3001` | Porta do servidor |
| `VITE_WEB_PORT` | `5173` | Porta do front web |
| `VITE_API_URL` | `http://localhost:3001` | URL da API |
| `MOCKLY_DATA_DIR` | `~/.mockly/` | Diretório de dados |

---

## Funcionalidades Implementadas

### Servidor (packages/server)

- [x] Endpoints GET, POST, PUT, DELETE
- [x] Respostas JSON customizadas
- [x] Delay por endpoint (simular latência)
- [x] Templates Faker (dados randomizados)
- [x] Logs de requisições
- [x] API REST para gerenciamento
- [x] Auto-inicialização quando executado
- [x] **Persistência de dados em JSON** (~/.mockly/data.json)
- [x] **Dados de exemplo** (seed) na primeira execução
- [ ] **Schemas API** - Criar/editar schemas (tabelas)
- [ ] **Schema Generation** - Gerar dados fake a partir de schema

### Front Web (packages/web)

- [x] Lista de endpoints
- [x] Criar endpoint (modal)
- [x] Editar endpoint
- [x] Deletar endpoint
- [x] Testar endpoint
- [x] Visualizar resposta
- [x] Visualizador de logs
- [x] Templates Faker dropdown
- [x] Toast notifications
- [x] Status de conexão do servidor
- [x] **Storybook para componentes UI**
- [ ] **Schemas Page** - Gerir schemas (tabelas)
- [ ] **Schema Editor** - Criar/editar schemas com campos
- [ ] **Schema Canvas** - Drag-and-drop de tabelas
- [ ] **Relationship Editor** - Visualizar/editar relações
- [ ] **Schema Selector** - Usar schema como response

### CLI (packages/cli)

- [x] Comando `start` - inicia tudo
- [x] Comando `server` - apenas servidor
- [x] Comando `web` - apenas front web
- [x] Abertura automática do browser

### Hooks (packages/hooks)

- [x] `useMockEndpoints` - CRUD de endpoints
- [x] `useMockEndpoint` - Endpoint específico por ID
- [x] `useMockLogs` - Gestão de logs
- [x] `useMockServer` - Estado e conexão do servidor
- [x] `MocklyProvider` - Provider TanStack Query
- [x] Tipos TypeScript completos

---

## Estrutura de Diretórios

```
/mockly
├── packages/
│   ├── server/
│   │   ├── src/
│   │   │   ├── index.ts           # Entry point + auto-start
│   │   │   ├── server.ts          # Servidor Express
│   │   │   ├── routes/
│   │   │   │   └── mockRoutes.ts  # Rotas API
│   │   │   ├── models/
│   │   │   │   └── Endpoint.ts   # Modelo de endpoint
│   │   │   ├── utils/
│   │   │   │   ├── faker.ts      # Utilitário Faker
│   │   │   │   ├── logger.ts     # Logger
│   │   │   │   └── storage.ts    # Persistência JSON
│   │   │   └── types/
│   │   │       └── index.ts      # TypeScript types
│   │   ├── tests/                 # Testes Jest
│   │   ├── package.json          # bin: mockly-server
│   │   └── tsconfig.json
│   │
│   ├── web/
│   │   ├── .storybook/           # Configuração Storybook
│   │   │   ├── main.ts
│   │   │   ├── preview.ts
│   │   │   └── preview.css
│   │   ├── src/
│   │   │   ├── components/       # Componentes React
│   │   │   │   ├── ui/         # shadcn components + stories
│   │   │   │   │   ├── button.stories.tsx
│   │   │   │   │   ├── dialog.stories.tsx
│   │   │   │   │   └── toaster.stories.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── EndpointCard.tsx
│   │   │   │   ├── EndpointForm.tsx
│   │   │   │   ├── ResponseViewer.tsx
│   │   │   │   ├── LogsViewer.tsx
│   │   │   │   └── FakerTemplates.tsx
│   │   │   ├── pages/
│   │   │   │   └── Home.tsx
│   │   │   ├── services/
│   │   │   │   └── api.ts       # API client
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts
│   │   │   │   └── toast.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── cli/
│       ├── src/
│       │   ├── index.ts          # Entry + Commander
│       │   └── commands/
│       │       ├── start.ts
│       │       ├── server.ts
│       │       └── web.ts
│       ├── package.json          # bin: mockly
│       └── tsconfig.json
│   │
│   └── hooks/                    # React hooks
│       ├── src/
│       │   ├── index.ts           # Exports
│       │   ├── api.ts             # API client
│       │   ├── types.ts           # TypeScript types
│       │   ├── MocklyProvider.tsx # TanStack Query provider
│       │   ├── useMockEndpoints.ts
│       │   ├── useMockLogs.ts
│       │   └── useMockServer.ts
│       ├── package.json
│       └── tsup.config.ts
│
├── package.json                  # Root com workspaces
├── README.md
├── context.md
└── LICENSE
```

---

## Próximos Passos (Pendente)

### Sistema de Schemas/Tabelas

#### Fase 1: Backend - Gerar dados fake do schema
- [x] Schema Model (CRUD schemas, tabelas, campos, relações)
- [x] Schema API Routes
- [x] Rota `/schemas/:id/generate` - Gerar dados fake a partir de tabela
- [x] Faker integration com tipos de campo existentes

#### Fase 2: Frontend - Integração Schema ↔ Endpoint
- [x] Atualizar tipos - Adicionar `schemaRef` no CreateEndpointDto
- [x] Componente SchemaSelector no EndpointForm
- [x] Gerar response automaticamente ao selecionar tabela

#### Fase 3: Response/Payload com JSON ou TS + Dados persistidos
- [x] Backend - Gerar múltiplos registros (count) via API
- [x] Backend - Auto-criar GET após POST com storedData em data.json
- [x] Backend - Payload Type (json ou ts)
- [x] Backend - Response/Payload como JSON ou TS
- [x] Frontend - Campo de contagem no EndpointForm
- [x] Frontend - Seleção tipo response (json/ts)
- [x] Frontend - Seleção schema para payload
- [x] Frontend - Preview do response TS
- [x] Frontend - Inferir tipos automaticamente no JSON (string, number, boolean)
- [x] Frontend - Selecionar campo para aplicar Faker
- [x] Backend - Processar storedData corretamente no GET

#### Fase 4: Login JWT
- [x] Rota de login `/auth/login`
- [x] Geração de token JWT
- [x] Middleware de autenticação
- [x] UI para configurar login
- [x] Suporte a múltiplos tipos (JWT, Basic, API Key, Bearer)
- [x] Allow Register dinâmico
- [x] Settings page para config de auth
- [x] Toggle "Requires Auth" por endpoint

#### Fase 5: Simplificação Endpoint Creation
- [x] Remover campo manual de response do EndpointForm
- [x] Schema/Table obrigatório para criar endpoint
- [x] Modo custom keys quando não há schema (chaves separadas por vírgula)
- [x] Toggle "Array" para definir se response é array ou objeto único
- [x] Suporte a relacionamentos (one-to-one, one-to-many) no generate
- [x] Remover definição de payload - automático da estrutura da tabela
- [x] Auto-criar rotas de auth quando habilitadas
- [x] Token Expiry como select (1h, 6h, 12h, 24h, 7d, 30d)
- [x] Botão Generate para API Key

#### Fase 6: Correções e Melhorias
- [x] Corrigir EndpointForm - preencher schema/table ao editar
- [x] Corrigir validação no submit para permitir edição sem schema
- [x] Adicionar botão Reset All em Settings
- [x] Limpar auth endpoints e usuários ao desabilitar autenticação

### Items Concluídos
- [x] Schema Editor - Criar/editar schemas com campos
- [x] Schema Canvas - Drag-and-drop de tabelas
- [x] Relationship Editor - Visualizar/editar relações
- [x] Backend - Schema API + Storage
- [x] AlertDialog component (shadcn)
- [x] Substituir prompt/confirm/alert por Dialog e AlertDialog
- [x] Settings page para autenticação

- [ ] Publicar no npm

---

*Este arquivo será atualizado a cada fase implementada.*
