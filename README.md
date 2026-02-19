# Mockly

[![npm version](https://img.shields.io/npm/v/mockly)](https://www.npmjs.com/package/mockly)
[![Build](https://img.shields.io/github/actions/workflow/status/Miguel-Leite/mockly/ci.yml)](https://github.com/Miguel-Leite/mockly/actions)
[![Tests](https://img.shields.io/badge/tests-56%20passed-brightgreen)](https://github.com/Miguel-Leite/mockly)
[![License](https://img.shields.io/npm/l/mockly)](LICENSE)
[![Node.js](https://img.shields.io/node/v/mockly)](https://nodejs.org)

Mock APIs rapidinho, desenvolva sem esperar o backend

## What is Mockly?

Mockly is a powerful tool for creating mock APIs locally, enabling frontend developers to work independently without waiting for the backend to be ready.

Whether you're prototyping a new feature, building a React application, or need a quick backend for testing, Mockly provides a flexible and easy-to-use solution.

## Why Mockly?

- **Zero Configuration** - Get started in seconds with minimal setup
- **Flexible API Creation** - Define custom responses for any endpoint
- **Simulate Real-world Scenarios** - Add delays to mimic network latency
- **Full HTTP Methods** - Support for GET, POST, PUT, and DELETE
- **TypeScript Ready** - Built with TypeScript for type safety
- **Easy Integration** - Works with any frontend framework

## Installation

```bash
npm install mockly
```

## Quick Start

```typescript
import { startMockServer, endpointModel } from 'mockly';

// Start the mock server
const server = startMockServer({ port: 3001 });

// Create a mock endpoint
endpointModel.create({
  path: '/api/users',
  method: 'GET',
  response: { 
    users: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ] 
  }
});

console.log('Mock server running at http://localhost:3001');
```

Now you can make requests to `http://localhost:3001/api/users`

## Usage with Delay

Simulate network latency with the delay option:

```typescript
endpointModel.create({
  path: '/api/slow-endpoint',
  method: 'GET',
  response: { message: 'This took a while!' },
  delay: 2000  // 2 seconds
});
```

## Random Data with Faker

Generate realistic fake data using Faker templates:

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
        phone: '{{faker.phone}}',
        address: '{{faker.city}}, {{faker.country}}',
        company: '{{faker.company}}',
        avatar: '{{faker.avatar}}',
        isActive: '{{faker.boolean}}'
      }
    ]
  }
});
```

### Available Faker Templates

| Template | Description |
|----------|-------------|
| `{{faker.name}}` | Full name |
| `{{faker.firstName}}` | First name |
| `{{faker.lastName}}` | Last name |
| `{{faker.email}}` | Email address |
| `{{faker.phone}}` | Phone number |
| `{{faker.uuid}}` | UUID |
| `{{faker.boolean}}` | Boolean |
| `{{faker.number}}` | Random number |
| `{{faker.date}}` | Recent date |
| `{{faker.city}}` | City name |
| `{{faker.country}}` | Country name |
| `{{faker.street}}` | Street address |
| `{{faker.url}}` | URL |
| `{{faker.avatar}}` | Avatar URL |
| `{{faker.company}}` | Company name |
| `{{faker.word}}` | Random word |
| `{{faker.sentence}}` | Random sentence |
| `{{faker.paragraph}}` | Random paragraph |

## Request Logs

View and manage request logs via API:

```bash
# Get all request logs
GET http://localhost:3001/api/logs

# Clear all logs
DELETE http://localhost:3001/api/logs
```

Or programmatically:

```typescript
const logs = server.getLogs();
server.clearLogs();
```

## API Reference

### Server

#### `startMockServer(config?)`
Starts the mock server automatically and returns the server instance.

```typescript
const server = startMockServer({ port: 3001 });
```

#### `createMockServer(config?)`
Creates a server instance without starting it.

```typescript
const server = createMockServer({ port: 3001 });
await server.start();
```

### Server Instance Methods

- `server.start()` - Start the server
- `server.stop()` - Stop the server
- `server.getLogs()` - Get request logs
- `server.clearLogs()` - Clear request logs
- `server.getPort()` - Get the port number

### Endpoint Model

#### `endpointModel.create(dto)`
Create a new mock endpoint.

```typescript
const endpoint = endpointModel.create({
  path: '/api/users',
  method: 'GET',
  response: { users: [] },
  delay: 500
});
```

#### `endpointModel.findAll()`
Get all created endpoints.

```typescript
const endpoints = endpointModel.findAll();
```

#### `endpointModel.findById(id)`
Find an endpoint by its ID.

```typescript
const endpoint = endpointModel.findById('uuid-here');
```

#### `endpointModel.findByPath(path, method)`
Find an endpoint by path and HTTP method.

```typescript
const endpoint = endpointModel.findByPath('/api/users', 'GET');
```

#### `endpointModel.update(id, dto)`
Update an existing endpoint.

```typescript
endpointModel.update('uuid-here', {
  response: { updated: true }
});
```

#### `endpointModel.delete(id)`
Delete an endpoint.

```typescript
endpointModel.delete('uuid-here');
```

#### `endpointModel.clear()`
Delete all endpoints.

```typescript
endpointModel.clear();
```

## Configuration

### Server Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | `number` | `3001` | Server port |
| `cors` | `boolean` | `true` | Enable CORS |

### Endpoint DTO

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `path` | `string` | Yes | Endpoint path (e.g., `/api/users`) |
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | Yes | HTTP method |
| `response` | `object` | Yes | JSON response body |
| `delay` | `number` | No | Response delay in milliseconds |

## REST API

When the server is running, you can also manage endpoints via HTTP:

```bash
# Create endpoint
POST http://localhost:3001/api/endpoints
Content-Type: application/json

{
  "path": "/api/users",
  "method": "GET",
  "response": { "users": [] }
}

# Get all endpoints
GET http://localhost:3001/api/endpoints

# Get endpoint by ID
GET http://localhost:3001/api/endpoints/:id

# Update endpoint
PUT http://localhost:3001/api/endpoints/:id
Content-Type: application/json

{ "response": { "updated": true } }

# Delete endpoint
DELETE http://localhost:3001/api/endpoints/:id

# Get request logs
GET http://localhost:3001/api/logs

# Clear request logs
DELETE http://localhost:3001/api/logs
```

## Diagrams & Schemas

Create visual diagrams to model your data and generate mock data automatically.

### Using the Web UI

1. Start the server: `npm run dev`
2. Open http://localhost:5173
3. Click **Diagrams** in the header
4. Create a new Schema (e.g., "E-commerce")
5. Add tables and define fields with types (string, number, date, email, uuid, etc.)
6. Create relationships between tables (one-to-one, one-to-many, many-to-many)

### Generate Data from Schemas

When creating an endpoint, select a schema/table to automatically generate the response JSON:

```bash
# Generate data from a table
POST http://localhost:3001/api/schemas/:id/generate
Content-Type: application/json

{
  "tableId": "table-uuid",
  "count": 5
}
```

Returns an array of generated records based on the table schema.

### Schema Types

| Type | Description |
|------|-------------|
| `string` | Random word |
| `number` | Random number |
| `boolean` | True or false |
| `date` | Recent date |
| `email` | Fake email |
| `uuid` | UUID v4 |
| `phone` | Phone number |
| `address` | Street address |
| `url` | URL |
| `custom` | Custom faker template |

### Schema API

```bash
# Get all schemas
GET http://localhost:3001/api/schemas

# Create schema
POST http://localhost:3001/api/schemas
{ "name": "My Schema" }

# Add table
POST http://localhost:3001/api/schemas/:id/tables
{ "name": "users", "position": { "x": 100, "y": 100 } }

# Add field
POST http://localhost:3001/api/schemas/:id/tables/:tableId/fields
{ "name": "email", "type": "email", "required": true }

# Add relation
POST http://localhost:3001/api/schemas/:id/relations
{ "fromTable": "table-id-1", "toTable": "table-id-2", "type": "one-to-many" }
```

## Coming Soon

- **JWT Authentication** - Protect endpoints with JWT login routes

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Build all packages
npm run build
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run start` | Start server + web UI + browser |
| `npm run server` | Start only the mock server |
| `npm run web` | Start only the web UI |
| `npm run storybook` | Start Storybook (http://localhost:6006) |
| `npm run build-storybook` | Build Storybook static |
| `npm run test` | Run server tests |

### Storybook

The project includes Storybook for developing and documenting UI components.

```bash
# Start Storybook development server
npm run storybook

# Build static Storybook
npm run build-storybook
```

Components documented:
- Button (variants: default, destructive, outline, secondary, ghost, link)
- Dialog (with forms, destructive confirmations)
- Toaster (dark/light themes)

## React Hooks

Use `@mockly/hooks` to consume Mockly APIs in your React applications.

### Installation

```bash
npm install @mockly/hooks
```

### Quick Start

```typescript
import { MocklyProvider, useMockEndpoints, useMockServer } from '@mockly/hooks';

function App() {
  return (
    <MocklyProvider>
      <Dashboard />
    </MocklyProvider>
  );
}

function Dashboard() {
  const { isConnected } = useMockServer('http://localhost:3001');
  const { endpoints, create, remove } = useMockEndpoints('http://localhost:3001');

  return (
    <div>
      <p>Server: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <ul>
        {endpoints.map(ep => (
          <li key={ep.id}>{ep.method} {ep.path}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Available Hooks

| Hook | Description |
|------|-------------|
| `useMockServer(baseUrl)` | Check server connection status |
| `useMockEndpoints(baseUrl)` | CRUD operations for endpoints |
| `useMockEndpoint(baseUrl, id)` | Get single endpoint by ID |
| `useMockLogs(baseUrl)` | Get and clear request logs |

See the [hooks package](./packages/hooks) for full API documentation.

## Publishing

To publish this package to npm:

```bash
# Login to npm (if not already logged in)
npm login

# Build the package
cd packages/server
npm run build

# Publish
npm publish

# Or for scoped packages (if using @scope)
npm publish --access public
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
