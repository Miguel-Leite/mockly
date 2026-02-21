export default function HttpClientPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>HTTP Client</h1>
      <p className="text-lg text-muted-foreground">
        Teste seus endpoints diretamente na interface web.
      </p>

      <h2>O que é o HTTP Client?</h2>
      <p>
        O HTTP Client integrado permite testar seus endpoints mock 
        sem sair da interface do Mockario. É como um Postman/Insomnia 
        integrado.
      </p>

      <h2>Como Usar</h2>
      <ol>
        <li>Acesse a seção "HTTP Client" na interface web</li>
        <li>Selecione o método HTTP (GET, POST, PUT, DELETE)</li>
        <li>Digite a URL do endpoint</li>
        <li>Adicione headers se necessário</li>
        <li>Adicione body para POST/PUT/PATCH</li>
        <li>Clique em "Send"</li>
        <li>Veja a resposta</li>
      </ol>

      <h2>Selecionar Endpoint</h2>
      <p>
        Você pode selecionar um endpoint da lista para preencher 
        automaticamente URL, método e headers:
      </p>
      <ul>
        <li>Clique no seletor de endpoints</li>
        <li>Escolha o endpoint desejado</li>
        <li>Os campos serão preenchidos automaticamente</li>
      </ul>

      <h2>Autenticação</h2>
      <p>
        O HTTP Client suporta os seguintes tipos de autenticação:
      </p>
      <ul>
        <li><strong>Bearer Token</strong> - Para JWT</li>
        <li><strong>Basic Auth</strong> - Username e password</li>
        <li><strong>API Key</strong> - Chave de API no header</li>
      </ul>

      <h2>Histórico</h2>
      <p>
        Suas requisições são salvas no histórico para que você 
        possa revisitar e executar novamente.
      </p>
    </div>
  );
}
