# Mockario

Mock APIs quickly, develop without waiting for the backend.

A complete tool for creating mock APIs locally, featuring a visual interface and React hooks.

## Installation

```bash
npm install @mockario/mockario
```

## Quick Start

### CLI (Recommended)

```bash
npx @mockario/mockario start
```

This opens:
- **Web UI**: http://localhost:3001
- **API Server**: http://localhost:3001

### Programmatic Usage

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

## React Hooks

Use the built-in React hooks to consume Mockario APIs in your React applications:

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

## Features

- Custom API endpoints (GET, POST, PUT, DELETE)
- Faker data generation
- Response delays (simulate latency)
- Request logging
- Auto-create endpoints
- JSON data persistence
- Authentication (JWT, Basic, API Key)
- Visual schema editor
- HTTP Client (like Postman)

## License

MIT
