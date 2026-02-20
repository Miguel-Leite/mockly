# Mockly

[![npm version](https://img.shields.io/npm/v/mockly)](https://www.npmjs.com/package/mockly)
[![Build](https://img.shields.io/github/actions/workflow/status/Miguel-Leite/mockly/ci.yml)](https://github.com/Miguel-Leite/mockly/actions)
[![Tests](https://img.shields.io/badge/tests-56%20passed-brightgreen)](https://github.com/Miguel-Leite/mockly)
[![License](https://img.shields.io/npm/l/mockly)](LICENSE)
[![Node.js](https://img.shields.io/node/v/mockly)](https://nodejs.org)

⚠️ **Mockly is for development only. Not for production.**

---

## What is Mockly?

Mockly is a powerful tool for creating mock APIs locally, enabling frontend developers to work independently without waiting for the backend to be ready. Create endpoints, generate fake data, test authentication, and more - all from a beautiful visual interface.

---

## Quick Start

```bash
npx mockly start
```

This opens:
- **Web UI**: http://localhost:5173 (endpoint management)
- **API Server**: http://localhost:3001 (your mock endpoints)

---

## When should I use Mockly?

- **Prototyping** - Quickly create API endpoints for new features
- **Frontend Development** - Work without waiting for backend implementation
- **Testing** - Simulate various API responses and auth scenarios
- **Demos & Presentations** - Show functional prototypes without a real backend

---

## Core Features

- ✅ Custom API endpoints (GET, POST, PUT, DELETE)
- ✅ Faker data generation with realistic data
- ✅ Response delays (simulate network latency)
- ✅ Request logging
- ✅ Auto-create endpoints from requests
- ✅ Stored data persistence
- ✅ JSON data persistence (~/.mockly/data.json)

---

## Advanced Features

### Web UI
Beautiful visual interface for managing all your mock endpoints.

### Schemas
Visual data modeling with drag-and-drop tables and relationships (one-to-one, one-to-many, many-to-many). Generate fake data automatically from schema definitions.

### HTTP Client
Built-in Postman-like HTTP client to test your endpoints. Supports authentication headers (Bearer, Basic, API Key).

### Authentication
Protect endpoints with JWT, Basic Auth, or API Key. Auto-generates /auth/login, /auth/register, and /auth/me endpoints.

### React Hooks
Use `@mockly/hooks` package to consume Mockly APIs in your React applications.

---

For complete documentation, see [ADVANCED.md](./ADVANCED.md).

---

## CLI / Commands

| Command | Description |
|---------|-------------|
| `npx mockly start` | Start server + web UI + open browser |
| `npx mockly start --no-open` | Start without opening browser |
| `npx mockly start -p 4000` | Custom server port |
| `npx mockly start -w 3000` | Custom web port |
| `npx mockly server` | Server only (port 3001) |
| `npx mockly server -p 4000` | Custom server port |
| `npx mockly web` | Web UI only (port 5173) |

---

## Quick Example

```typescript
import { startMockServer, endpointModel } from 'mockly';

const server = startMockServer({ port: 3001 });

endpointModel.create({
  path: '/api/users',
  method: 'GET',
  response: { 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' }
    ] 
  }
});

console.log('Mock server running at http://localhost:3001');
```

### Faker Data

```typescript
endpointModel.create({
  path: '/api/users',
  method: 'GET',
  response: {
    users: [
      {
        id: '{{faker.uuid}}',
        name: '{{faker.name}}',
        email: '{{faker.email}}',
        avatar: '{{faker.avatar}}'
      }
    ]
  }
});
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/endpoints` | List all endpoints |
| POST | `/api/endpoints` | Create endpoint |
| GET | `/api/endpoints/:id` | Get endpoint |
| PUT | `/api/endpoints/:id` | Update endpoint |
| DELETE | `/api/endpoints/:id` | Delete endpoint |
| GET | `/api/logs` | View request logs |
| DELETE | `/api/logs` | Clear logs |
| GET | `/api/schemas` | List schemas |
| POST | `/api/schemas` | Create schema |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/me` | Get current user |

For complete API documentation, see [ADVANCED.md](./ADVANCED.md).

---

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start development
npm run start

# Start server only
npm run server

# Start web UI only
npm run web

# Run tests
npm run test

# Start Storybook
npm run storybook
```

---

## Packages

| Package | Description |
|---------|-------------|
| `mockly` | Core server package |
| `@mockly/hooks` | React hooks for consuming APIs |
| `@mockly/cli` | CLI tool |

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.
