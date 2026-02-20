# Advanced Features

Complete documentation for all Mockly features.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Schemas & Data Modeling](#2-schemas--data-modeling)
3. [HTTP Client](#3-http-client)
4. [React Hooks](#4-react-hooks)
5. [REST API Reference](#5-rest-api-reference)
6. [Custom Keys with Types](#6-custom-keys-with-types)
7. [Request Body Definition](#7-request-body-definition)
8. [Stored Data](#8-stored-data)
9. [Auto-create Endpoints](#9-auto-create-endpoints)
10. [Faker Templates](#10-faker-templates)
11. [Development](#11-development)

---

## 1. Authentication

Mockly supports multiple authentication types to protect your endpoints.

### Enabling Authentication

**Via Web UI:**
1. Go to Settings page
2. Enable "Authentication"
3. Select auth type (JWT, Basic, API Key, Bearer)
4. Configure options (secret, expiry, etc.)
5. Add users
6. Save Settings

**Via API:**
```bash
# Update auth settings
PUT http://localhost:3001/api/auth/settings
{
  "enabled": true,
  "type": "jwt",
  "jwtSecret": "your-secret-key",
  "jwtExpiry": "24h",
  "allowRegister": false
}

# Create user
POST http://localhost:3001/api/auth/users
{
  "username": "admin",
  "password": "password123"
}
```

### Auth Types

#### JWT (JSON Web Token)
- Generates JWT tokens on login
- Configurable expiry (1h, 6h, 12h, 24h, 7d, 30d)
- Requires JWT secret

```typescript
// Login response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "admin" }
}
```

#### Basic Auth
- Standard HTTP Basic authentication
- Username/password validation

```bash
# Request with Basic Auth
curl -u username:password http://localhost:3001/api/protected
```

#### API Key
- Single API key for all requests
- Custom header name

```bash
# Request with API Key
curl -H "X-API-Key: your-api-key" http://localhost:3001/api/protected
```

#### Bearer Token
- Similar to JWT but without validation
- Accepts any Bearer token

### Protected Endpoints

When auth is enabled, you can mark specific endpoints as requiring authentication:

```typescript
endpointModel.create({
  path: '/api/admin/users',
  method: 'GET',
  response: { users: [] },
  authRequired: true  // Requires authentication
});
```

### Auto-generated Auth Routes

When authentication is enabled, these endpoints are automatically created:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration (if enabled) |
| GET | `/api/auth/me` | Get current user info |

---

## 2. Schemas & Data Modeling

Schemas allow you to visually model your data structure and generate fake data automatically.

### Creating a Schema

**Via Web UI:**
1. Go to Schemas page
2. Click "New Schema"
3. Enter schema name (e.g., "E-commerce")
4. Add tables with fields

### Tables & Fields

Each table can have multiple fields with types:

| Type | Generated Data |
|------|----------------|
| `string` | Random word |
| `number` | Random number |
| `boolean` | True or false |
| `date` | Recent date |
| `email` | Fake email address |
| `uuid` | UUID v4 |
| `phone` | Phone number |
| `address` | Street address |
| `url` | URL |
| `custom` | Custom faker template |

### Field Options

- **Required** - Mark field as required
- **Faker Template** - Custom faker template (e.g., `{{faker.name}}`)

### Relationships

Create relationships between tables:

- **One-to-One** - One record relates to one record
- **One-to-Many** - One record relates to multiple records
- **Many-to-Many** - Multiple records relate to multiple records

### Generating Data

When creating an endpoint, select a schema/table to automatically generate response:

```bash
# Generate 5 user records
POST http://localhost:3001/api/schemas/:id/generate
{
  "tableId": "table-uuid",
  "count": 5
}
```

Response:
```json
[
  { "id": "uuid-1", "name": "John", "email": "john@example.com" },
  { "id": "uuid-2", "name": "Jane", "email": "jane@example.com" },
  ...
]
```

### Schema API

```bash
# Get all schemas
GET /api/schemas

# Create schema
POST /api/schemas
{ "name": "My Schema" }

# Get schema
GET /api/schemas/:id

# Update schema
PUT /api/schemas/:id
{ "name": "Updated Name" }

# Delete schema
DELETE /api/schemas/:id

# Add table
POST /api/schemas/:id/tables
{ "name": "users", "position": { "x": 100, "y": 100 } }

# Update table
PUT /api/schemas/:id/tables/:tableId
{ "name": "updated-name" }

# Delete table
DELETE /api/schemas/:id/tables/:tableId

# Add field
POST /api/schemas/:id/tables/:tableId/fields
{ "name": "email", "type": "email", "required": true }

# Add relationship
POST /api/schemas/:id/relations
{ "fromTable": "table-id-1", "toTable": "table-id-2", "type": "one-to-many" }
```

---

## 3. HTTP Client

Built-in HTTP client for testing endpoints (similar to Postman/Insomnia).

### Features

- **Endpoint Selector** - Select from existing endpoints
- **Method Selection** - GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
- **Custom Headers** - Add any headers
- **Request Body** - JSON editor for POST/PUT/PATCH
- **Authentication** - Bearer, Basic, API Key support
- **Response Viewer** - View status, time, and body

### Using the HTTP Client

1. Go to HTTP Client page
2. Select an endpoint from the dropdown (or enter URL manually)
3. The URL, method, and body are auto-filled
4. Modify as needed
5. Click Send
6. View response

### Authentication in HTTP Client

The HTTP Client has an "Auth" tab with options:

- **None** - No authentication
- **Bearer** - Enter JWT token
- **Basic** - Enter username and password
- **API Key** - Enter header name and API key

Click "Apply to Headers" to add the auth to your request.

---

## 4. React Hooks

Use `@mockly/hooks` to consume Mockly APIs in your React applications.

### Installation

```bash
npm install @mockly/hooks
```

### Quick Start

```tsx
import { MocklyProvider, useMockEndpoints, useMockServer } from '@mockly/hooks';

function App() {
  return (
    <MocklyProvider baseUrl="http://localhost:3001">
      <Dashboard />
    </MocklyProvider>
  );
}

function Dashboard() {
  const { isConnected } = useMockServer();
  const { endpoints, create, remove, isLoading } = useMockEndpoints();

  if (!isConnected) return <div>Server not connected</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Endpoints</h1>
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

#### useMockServer()
Check server connection status.

```typescript
const { isConnected, checkConnection } = useMockServer();
```

#### useMockEndpoints()
CRUD operations for endpoints.

```typescript
const { 
  endpoints, 
  isLoading, 
  create, 
  update, 
  remove,
  getById 
} = useMockEndpoints();
```

#### useMockLogs()
View and clear request logs.

```typescript
const { 
  logs, 
  isLoading, 
  clear 
} = useMockLogs();
```

#### useMockEndpoint(id)
Get single endpoint by ID.

```typescript
const { endpoint, isLoading } = useMockEndpoint('endpoint-id');
```

---

## 5. REST API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/endpoints` | List all endpoints |
| POST | `/api/endpoints` | Create endpoint |
| GET | `/api/endpoints/:id` | Get endpoint by ID |
| PUT | `/api/endpoints/:id` | Update endpoint |
| DELETE | `/api/endpoints/:id` | Delete endpoint |

### Request Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | Get all request logs |
| DELETE | `/api/logs` | Clear all logs |

### Schemas

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemas` | List all schemas |
| POST | `/api/schemas` | Create schema |
| GET | `/api/schemas/:id` | Get schema |
| PUT | `/api/schemas/:id` | Update schema |
| DELETE | `/api/schemas/:id` | Delete schema |
| POST | `/api/schemas/:id/tables` | Add table |
| POST | `/api/schemas/:id/tables/:tableId/fields` | Add field |
| POST | `/api/schemas/:id/relations` | Add relationship |
| POST | `/api/schemas/:id/generate` | Generate data |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/settings` | Get auth settings |
| PUT | `/api/auth/settings` | Update auth settings |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | List users |
| POST | `/api/auth/users` | Create user |
| DELETE | `/api/auth/users/:id` | Delete user |

### Create Endpoint Payload

```json
{
  "path": "/api/users",
  "method": "GET",
  "response": { "users": [] },
  "responseType": "json",
  "delay": 0,
  "authRequired": false,
  "schemaRef": {
    "schemaId": "schema-uuid",
    "tableId": "table-uuid"
  },
  "responseKeys": ["name:string", "email:email"],
  "requestBody": {
    "source": "keys",
    "keys": ["username:string", "password:string"]
  }
}
```

---

## 6. Custom Keys with Types

Define response keys with explicit types for better fake data generation.

### Format

Use `key:type` format:

```
name:string, email:email, age:number, isActive:boolean
```

### Available Types

| Type | Generated Data |
|------|----------------|
| `string` | Random word |
| `number` | Random number (1-1000) |
| `boolean` | True or false |
| `date` | ISO date string |
| `email` | Fake email |
| `phone` | Phone number |
| `uuid` | UUID v4 |
| `url` | URL |
| `address` | Street address |
| `city` | City name |
| `country` | Country name |
| `avatar` | Avatar URL |
| `company` | Company name |

### Known Fields Auto-detection

Fields with known names are automatically detected:

```
name, email, phone, address, city, country, url, 
avatar, company, age, isActive, createdAt, etc.
```

Example:
```
name → generates full name
email → generates email
phone → generates phone number
```

---

## 7. Request Body Definition

When creating POST, PUT, or PATCH endpoints, you can define the expected request body structure.

### Methods

1. **Schema** - Use fields from an existing schema table
2. **Keys** - Define keys with types (e.g., `username:string, password:string`)
3. **Example** - Provide a JSON example

### Via API

```json
{
  "requestBody": {
    "source": "keys",
    "keys": ["username:string", "email:email", "password:string"]
  }
}
```

Or with schema:

```json
{
  "requestBody": {
    "source": "schema",
    "schemaRef": {
      "schemaId": "schema-uuid",
      "tableId": "table-uuid"
    }
  }
}
```

Or with example:

```json
{
  "requestBody": {
    "source": "example",
    "example": {
      "username": "john",
      "email": "john@example.com"
    }
  }
}
```

---

## 8. Stored Data

Mockly can persist data sent via POST/PUT requests.

### How It Works

When you send data to an endpoint:

1. If a GET endpoint exists for the same path, data is stored
2. Subsequent GET requests return stored data
3. Data persists in `~/.mockly/data.json`

### Example

```bash
# Create a user via POST
POST http://localhost:3001/api/users
{ "name": "John", "email": "john@example.com" }

# GET now returns stored data
GET http://localhost:3001/api/users
# Returns: [{ "name": "John", "email": "john@example.com" }]

# POST again adds more data
POST http://localhost:3001/api/users
{ "name": "Jane", "email": "jane@example.com" }

# GET returns all stored data
GET http://localhost:3001/api/users
# Returns: [
#   { "name": "John", "email": "john@example.com" },
#   { "name": "Jane", "email": "jane@example.com" }
# ]
```

---

## 9. Auto-create Endpoints

Mockly can automatically create endpoints from incoming requests.

### How It Works

When a POST/PUT request is made to a non-existent endpoint:

1. If a GET endpoint exists, data is stored
2. If no GET endpoint exists, a new GET endpoint is created with the sent data

### Example

```bash
# POST to non-existent endpoint
POST http://localhost:3001/api/products
{ "name": "Product 1", "price": 99.99 }

# A GET endpoint is automatically created
# GET http://localhost:3001/api/products now returns:
# [{ "name": "Product 1", "price": 99.99 }]
```

---

## 10. Faker Templates

Generate realistic fake data using Faker templates.

### Usage in Responses

```json
{
  "id": "{{faker.uuid}}",
  "name": "{{faker.name}}",
  "email": "{{faker.email}}",
  "avatar": "{{faker.avatar}}",
  "company": "{{faker.company}}"
}
```

### Available Templates

| Template | Description | Example |
|---------|-------------|---------|
| `{{faker.name}}` | Full name | John Doe |
| `{{faker.firstName}}` | First name | John |
| `{{faker.lastName}}` | Last name | Doe |
| `{{faker.email}}` | Email | john@example.com |
| `{{faker.phone}}` | Phone | 123-456-7890 |
| `{{faker.uuid}}` | UUID | 550e8400-... |
| `{{faker.boolean}}` | Boolean | true/false |
| `{{faker.number}}` | Number | 1-1000 |
| `{{faker.date}}` | Date | 2024-01-15 |
| `{{faker.city}}` | City | New York |
| `{{faker.country}}` | Country | United States |
| `{{faker.street}}` | Street | 123 Main St |
| `{{faker.url}}` | URL | https://... |
| `{{faker.avatar}}` | Avatar URL | https://... |
| `{{faker.company}}` | Company | Acme Inc |
| `{{faker.word}}` | Word | dolor |
| `{{faker.sentence}}` | Sentence | Lorem ipsum |
| `{{faker.paragraph}}` | Paragraph | Lorem... |

---

## 11. Development

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
| `npm run server` | Server only |
| `npm run web` | Web UI only |
| `npm run test` | Run tests |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `VITE_WEB_PORT` | 5173 | Web UI port |
| `VITE_API_URL` | http://localhost:3001 | API URL |
| `MOCKLY_DATA_DIR` | ~/.mockly | Data directory |

### Project Structure

```
packages/
├── server/     # Core mock server
├── web/        # Web UI (React)
├── cli/        # CLI tool
└── hooks/      # React hooks
```

### Storybook

The project includes Storybook for developing UI components.

```bash
npm run storybook
# Opens http://localhost:6006
```

### Publishing

```bash
# Build server package
cd packages/server
npm run build

# Publish to npm
npm publish
```

---

## Support

- GitHub Issues: https://github.com/Miguel-Leite/mockly/issues
- npm Package: https://www.npmjs.com/package/mockly
