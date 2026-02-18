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

## Coming Soon

- **Web Interface** - Visual dashboard to manage endpoints
- **React Hooks** - Ready-to-use hooks for React applications
- **Persistent Storage** - Save endpoints to file or database

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
