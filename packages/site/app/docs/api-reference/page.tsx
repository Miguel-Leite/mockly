export default function APIReferencePage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>API Reference</h1>
      <p className="text-lg text-muted-foreground">
        Referência completa da API REST do Mockario.
      </p>

      <h2>Base URL</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>http://localhost:3001/api</code>
      </pre>

      <h2>Endpoints</h2>

      <h3>Mock Endpoints</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Método</th>
            <th className="text-left py-2">Rota</th>
            <th className="text-left py-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/mock/endpoints</td>
            <td className="py-2">Listar todos os endpoints</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/mock/endpoints</td>
            <td className="py-2">Criar endpoint</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-blue-600 font-mono">PUT</span></td>
            <td className="py-2 font-mono">/mock/endpoints/:id</td>
            <td className="py-2">Atualizar endpoint</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-red-600 font-mono">DELETE</span></td>
            <td className="py-2 font-mono">/mock/endpoints/:id</td>
            <td className="py-2">Deletar endpoint</td>
          </tr>
        </tbody>
      </table>

      <h3>Schemas</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Método</th>
            <th className="text-left py-2">Rota</th>
            <th className="text-left py-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/schemas</td>
            <td className="py-2">Listar schemas</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/schemas</td>
            <td className="py-2">Criar schema</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/schemas/:name/generate</td>
            <td className="py-2">Gerar dados</td>
          </tr>
        </tbody>
      </table>

      <h3>Logs</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Método</th>
            <th className="text-left py-2">Rota</th>
            <th className="text-left py-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/logs</td>
            <td className="py-2">Listar logs de requisições</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-red-600 font-mono">DELETE</span></td>
            <td className="py-2 font-mono">/logs</td>
            <td className="py-2">Limpar logs</td>
          </tr>
        </tbody>
      </table>

      <h3>Usuários (Auth)</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">Método</th>
            <th className="text-left py-2">Rota</th>
            <th className="text-left py-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/auth/register</td>
            <td className="py-2">Registrar usuário</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/auth/login</td>
            <td className="py-2">Login</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/auth/me</td>
            <td className="py-2">Obter usuário atual</td>
          </tr>
        </tbody>
      </table>

      <h2>Códigos de Status</h2>
      <ul>
        <li><strong>200</strong> - Sucesso</li>
        <li><strong>201</strong> - Criado</li>
        <li><strong>400</strong> - Bad Request</li>
        <li><strong>401</strong> - Unauthorized</li>
        <li><strong>404</strong> - Not Found</li>
        <li><strong>500</strong> - Internal Server Error</li>
      </ul>
    </div>
  );
}
