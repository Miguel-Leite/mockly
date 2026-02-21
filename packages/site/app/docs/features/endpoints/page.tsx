export default function EndpointsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Endpoints</h1>
      <p className="text-lg text-muted-foreground">
        Aprenda a criar e gerenciar endpoints mock.
      </p>

      <h2>Criar um Endpoint</h2>
      <p>
        Você pode criar endpoints através da interface web ou via API.
      </p>

      <h3>Via Interface Web</h3>
      <ol>
        <li>Acesse a interface web</li>
        <li>Clique em "New Endpoint"</li>
        <li>Defina o path, método e resposta</li>
        <li>Salve o endpoint</li>
      </ol>

      <h3>Via API</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`POST /api/mock/endpoints
{
  "path": "/api/users",
  "method": "GET",
  "response": { "users": [] },
  "statusCode": 200
}`}</code>
      </pre>

      <h2>Métodos Suportados</h2>
      <ul>
        <li><strong>GET</strong> - Recuperar dados</li>
        <li><strong>POST</strong> - Criar dados</li>
        <li><strong>PUT</strong> - Atualizar dados</li>
        <li><strong>DELETE</strong> - Remover dados</li>
        <li><strong>PATCH</strong> - Atualização parcial</li>
      </ul>

      <h2>Delay</h2>
      <p>
        Você pode adicionar um delay para simular latência de rede:
      </p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "path": "/api/users",
  "method": "GET",
  "delay": 1000,
  "response": { "users": [] }
}`}</code>
      </pre>
    </div>
  );
}
