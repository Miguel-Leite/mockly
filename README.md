# Mockario

<img src="./mockario.jpg" alt="Mockario - Mock APIs quickly, develop without waiting for the backend" width="100%" />

---

[![npm version](https://img.shields.io/npm/v/mockario)](https://www.npmjs.com/package/mockario)
[![Build](https://img.shields.io/github/actions/workflow/status/Miguel-Leite/mockario/ci.yml)](https://github.com/Miguel-Leite/mockario/actions)
[![Tests](https://img.shields.io/badge/tests-56%20passed-brightgreen)](https://github.com/Miguel-Leite/mockario)
[![License](https://img.shields.io/npm/l/mockario)](LICENSE)
[![Node.js](https://img.shields.io/node/v/mockario)](https://nodejs.org)

Mock APIs quickly, develop without waiting for the backend

⚠️ **Mockario is for development only. Not for production.**

---

## What is Mockario?

Mockario is a local mock API environment that helps developers build and test applications without relying on a real backend.

It provides a complete setup with a mock server, a visual management interface, and automatic data generation, allowing frontend and mobile developers to work faster and independently.

With Mockario, you can create REST endpoints, define custom responses, simulate network delays, manage authentication, and generate realistic fake data all running locally with zero configuration.

---

## Quick Start

```bash
npx mockario start
```

This opens:
- **Web UI**: http://localhost:3001 (endpoint management)
- **API Server**: http://localhost:3001 (your mock endpoints)

---

## When should I use Mockario?

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
- ✅ JSON data persistence (~/.mockario/data.json)

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
Use the built-in hooks from `mockario` package to consume Mockario APIs in your React applications.

```tsx
import { MockarioProvider, useMockEndpoints } from 'mockario';

function App() {
  return (
    <MockarioProvider>
      <UsersList />
    </MockarioProvider>
  );
}

function UsersList() {
  const { endpoints, isLoading } = useMockEndpoints('http://localhost:3001');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {endpoints.map(endpoint => (
        <li key={endpoint.id}>{endpoint.method} {endpoint.path}</li>
      ))}
    </ul>
  );
}
```

---

For complete documentation, see [ADVANCED.md](./ADVANCED.md).

---

## CLI / Commands

| Command | Description |
|---------|-------------|
| `npx mockario start` | Start server + web UI + open browser |
| `npx mockario start --no-open` | Start without opening browser |
| `npx mockario start -p 4000` | Custom server port |
| `npx mockario start -w 3000` | Custom web port |
| `npx mockario server` | Server only (port 3001) |
| `npx mockario server -p 4000` | Custom server port |
| `npx mockario web` | Web UI only (port 3001) |

---

## Quick Example

```typescript
import { startMockServer, endpointModel } from 'mockario';

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
| `mockario` | Core server + Web UI + React Hooks (all in one) |

All functionality (server, web interface, and React hooks) is included in the `mockario` package.

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.
