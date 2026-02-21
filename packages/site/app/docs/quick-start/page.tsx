export default function QuickStartPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Quick Start</h1>
      <p className="text-lg text-muted-foreground">
        Crie seu primeiro endpoint mock em menos de 5 minutos.
      </p>

      <h2>Iniciar o Servidor</h2>
      <p>Execute o comando abaixo para iniciar o Mockario:</p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>npx mockario start</code>
      </pre>

      <p>Este comando ira iniciar:</p>
      <ul>
        <li>Servidor mock na porta 3001</li>
        <li>Interface web na porta 5173</li>
        <li>Abrir automaticamente o browser</li>
      </ul>

      <h2>Criar seu Primeiro Endpoint</h2>
      <ol>
        <li>Acesse a interface web em http://localhost:5173</li>
        <li>Clique no botão "New Endpoint"</li>
        <li>Preencha os campos:</li>
        <ul>
          <li><strong>Path:</strong> /api/users</li>
          <li><strong>Method:</strong> GET</li>
          <li><strong>Response:</strong> {"{ \"users\": [] }"}</li>
        </ul>
        <li>Clique em "Save"</li>
      </ol>

      <h2>Testar o Endpoint</h2>
      <p>Agora você pode testar seu endpoint:</p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>curl http://localhost:3001/api/users</code>
      </pre>

      <h2>Próximos Passos</h2>
      <p>
        Explore mais funcionalidades:
      </p>
      <ul>
        <li><a href="/docs/features/endpoints" className="text-green-600 hover:underline">Endpoints</a> - Learn more about endpoints</li>
        <li><a href="/docs/features/schemas" className="text-green-600 hover:underline">Schemas</a> - Create data schemas</li>
        <li><a href="/docs/features/authentication" className="text-green-600 hover:underline">Authentication</a> - Add auth to your endpoints</li>
      </ul>
    </div>
  );
}
