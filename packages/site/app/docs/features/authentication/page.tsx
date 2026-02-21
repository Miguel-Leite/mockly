export default function AuthenticationPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Authentication</h1>
      <p className="text-lg text-muted-foreground">
        Adicione autenticação aos seus endpoints mock.
      </p>

      <h2>Tipos de Autenticação</h2>
      <p>
        O Mockario suporta diversos tipos de autenticação:
      </p>

      <h3>JWT (JSON Web Token)</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "jwt",
    "secret": "your-secret-key"
  }
}`}</code>
      </pre>

      <h3>API Key</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "apiKey",
    "header": "X-API-Key",
    "key": "your-api-key"
  }
}`}</code>
      </pre>

      <h3>Basic Auth</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "basic",
    "username": "admin",
    "password": "password"
  }
}`}</code>
      </pre>

      <h3>Bearer Token</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "bearer",
    "token": "your-bearer-token"
  }
}`}</code>
      </pre>

      <h2>Rotas de Auth Automáticas</h2>
      <p>
        O Mockario cria automaticamente rotas de autenticação:
      </p>
      <ul>
        <li><code>POST /api/auth/register</code> - Criar usuário</li>
        <li><code>POST /api/auth/login</code> - Fazer login</li>
        <li><code>GET /api/auth/me</code> - Obter usuário atual</li>
      </ul>

      <h2>Gerenciar Usuários</h2>
      <p>
        Você pode criar e gerenciar usuários através da interface web 
        ou da API.
      </p>
    </div>
  );
}
