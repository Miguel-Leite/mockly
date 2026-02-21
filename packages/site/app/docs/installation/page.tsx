export default function InstallationPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Installation</h1>
      <p className="text-lg text-muted-foreground">
        Aprenda como instalar e configurar o Mockario no seu projeto.
      </p>

      <h2>Requisitos</h2>
      <ul>
        <li>Node.js 18 ou superior</li>
        <li>npm ou yarn</li>
      </ul>

      <h2>Instalação</h2>
      <p>
        O Mockario pode ser instalado globalmente via npm:
      </p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>npm install -g mockario</code>
      </pre>

      <p>Ou pode ser usado diretamente com npx:</p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>npx mockario --version</code>
      </pre>

      <h2>Verificação</h2>
      <p>Para verificar se a instalação foi bem sucedida:</p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>npx mockario --help</code>
      </pre>

      <h2>Próximos Passos</h2>
      <p>
        Agora que você tem o Mockario instalado, vá para o{" "}
        <a href="/docs/quick-start" className="text-green-600 hover:underline">
          Quick Start
        </a>{" "}
        para criar seu primeiro endpoint mock.
      </p>
    </div>
  );
}
