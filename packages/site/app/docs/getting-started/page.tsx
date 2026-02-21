export default function GettingStartedPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Getting Started</h1>
      <p className="text-lg text-muted-foreground">
        Aprenda os conceitos básicos do Mockario e comece a usar em minutos.
      </p>

      <h2>O que é o Mockario?</h2>
      <p>
        Mockario é uma ferramenta para gerar APIs simuladas localmente, permitindo que 
        desenvolvedores de front-end trabalhem sem depender do backend.
      </p>

      <h2>Principais Funcionalidades</h2>
      <ul>
        <li>Crie endpoints mock com resposta JSON customizada</li>
        <li>Suporte a múltiplos métodos HTTP (GET, POST, PUT, DELETE)</li>
        <li>Schemas e relacionamentos visuais</li>
        <li>Geração automática de dados fake com Faker</li>
        <li>Autenticação: JWT, API Key, Basic, Bearer</li>
        <li>Interface web para gerenciar endpoints</li>
        <li>CLI para iniciar tudo com um comando</li>
      </ul>

      <h2>Próximos Passos</h2>
      <p>
        Pronto para começar? Vá para a página de{" "}
        <a href="/docs/installation" className="text-green-600 hover:underline">
          Installation
        </a>{" "}
        para aprender como instalar e configurar.
      </p>
    </div>
  );
}
