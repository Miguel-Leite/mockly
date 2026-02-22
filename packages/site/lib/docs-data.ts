export interface DocPage {
  titleEn: string;
  titlePt: string;
  slug: string;
  sectionEn: string;
  sectionPt: string;
  contentEn: string;
  contentPt: string;
}

export const docsPages: DocPage[] = [
  {
    titleEn: "Getting Started",
    titlePt: "Primeiros Passos",
    slug: "/docs/getting-started",
    sectionEn: "Getting Started",
    sectionPt: "Primeiros Passos",
    contentEn: `What is Mockario? Mockario is a tool to generate mock APIs locally, allowing front-end developers to work without depending on the backend. Mock APIs fast develop without waiting for the backend. Main Features: Create mock endpoints with custom JSON response, Support for multiple HTTP methods GET POST PUT DELETE, Visual schemas and relationships, Automatic fake data generation with Faker, Authentication JWT API Key Basic Bearer, Web interface to manage endpoints, CLI to start everything with one command.`,
    contentPt: `O que é o Mockario? Mockario é uma ferramenta para gerar APIs simuladas localmente, permitindo que desenvolvedores de front-end trabalhem sem depender do backend. Mock APIs rapidinho desenvolva sem esperar o backend. Principais Funcionalidades: Crie endpoints mock com resposta JSON customizada, Suporte a múltiplos métodos HTTP GET POST PUT DELETE, Schemas e relacionamentos visuais, Geração automática de dados fake com Faker, Autenticação JWT API Key Basic Bearer, Interface web para gerenciar endpoints, CLI para iniciar tudo com um comando.`,
  },
  {
    titleEn: "Installation",
    titlePt: "Instalação",
    slug: "/docs/installation",
    sectionEn: "Getting Started",
    sectionPt: "Primeiros Passos",
    contentEn: `Learn how to install and configure Mockario in your project. Requirements: Node.js 18 or higher, npm or yarn. Installation: Mockario can be installed globally via npm: npm install -g @mockario/mockario. Or it can be used directly with npx: npx @mockario/mockario --version. We recommend using npx to avoid global installations and always use the latest version. Verification: To verify the installation was successful: npx @mockario/mockario --help.`,
    contentPt: `Aprenda como instalar e configurar o Mockario no seu projeto. Requisitos: Node.js 18 ou superior, npm ou yarn. Instalação: O Mockario pode ser instalado globalmente via npm: npm install -g @mockario/mockario. Ou pode ser usado diretamente com npx: npx @mockario/mockario --version. Recomendamos usar npx para evitar instalações globais e sempre usar a versão mais recente. Verificação: Para verificar se a instalação foi bem sucedida: npx @mockario/mockario --help.`,
  },
  {
    titleEn: "Quick Start",
    titlePt: "Guia Rápido",
    slug: "/docs/quick-start",
    sectionEn: "Getting Started",
    sectionPt: "Primeiros Passos",
    contentEn: `Create your first mock endpoint in less than 5 minutes. Start the Server: Run the command below to start Mockario: npx @mockario/mockario start. This command will start: Mock server on port 3001, Web interface on port 5173, Automatically open browser. Create your First Endpoint: Access the web interface at http://localhost:5173, Click the New Endpoint button, Fill in the fields: Path, Method, Response, Click Save. Test the Endpoint: Now you can test your endpoint: curl http://localhost:3001/api/users.`,
    contentPt: `Crie seu primeiro endpoint mock em menos de 5 minutos. Iniciar o Servidor: Execute o comando abaixo para iniciar o Mockario: npx @mockario/mockario start. Este comando ira iniciar: Servidor mock na porta 3001, Interface web na porta 5173, Abrir automaticamente o browser. Criar seu Primeiro Endpoint: Acesse a interface web em http://localhost:5173, Clique no botão New Endpoint, Preencha os campos: Path, Method, Response, Clique em Save. Testar o Endpoint: Agora você pode testar seu endpoint: curl http://localhost:3001/api/users.`,
  },
  {
    titleEn: "Endpoints",
    titlePt: "Endpoints",
    slug: "/docs/features/endpoints",
    sectionEn: "Features",
    sectionPt: "Funcionalidades",
    contentEn: `Learn how to create and manage mock endpoints. Create an Endpoint: You can create endpoints via the web interface or API. Via Web Interface: Access the web interface, Click New Endpoint, Define the path method and response, Save the endpoint. Via API: POST /api/mock/endpoints with path method response statusCode. Supported Methods: GET Retrieve data, POST Create data, PUT Update data, DELETE Remove data, PATCH Partial update. Delay: You can add a delay to simulate network latency. The delay is in milliseconds. Use 1000 for 1 second of latency.`,
    contentPt: `Aprenda a criar e gerenciar endpoints mock. Criar um Endpoint: Você pode criar endpoints através da interface web ou via API. Via Interface Web: Acesse a interface web, Clique em New Endpoint, Defina o path método e resposta, Salve o endpoint. Via API: POST /api/mock/endpoints com path method response statusCode. Métodos Suportados: GET Recuperar dados, POST Criar dados, PUT Atualizar dados, DELETE Remover dados, PATCH Atualização parcial. Delay: Você pode adicionar um delay para simular latência de rede. O delay é em milissegundos. Use 1000 para 1 segundo de latência.`,
  },
  {
    titleEn: "Schemas",
    titlePt: "Schemas",
    slug: "/docs/features/schemas",
    sectionEn: "Features",
    sectionPt: "Funcionalidades",
    contentEn: `Create schemas and generate fake data automatically. What are Schemas? Schemas are data structure definitions that allow you to automatically generate fake data using Faker. Create a Schema: Access the Schemas section in the web interface, Click New Schema, Define the name and fields, Save the schema. Faker Fields: You can use various Faker data types: person.fullName, internet.email, number.int, location.streetAddress, phone.number, image.avatar, date.past. Generate Data: After creating a schema, you can generate fake data: GET /api/schema/users?count=10. Relationships: One-to-One, One-to-Many, Many-to-Many. Relationships allow you to create realistic data with associations between entities.`,
    contentPt: `Crie schemas e gere dados fake automaticamente. O que são Schemas? Schemas são definições de estrutura de dados que permitem gerar dados fake automaticamente usando Faker. Criar um Schema: Acesse a seção Schemas na interface web, Clique em New Schema, Defina o nome e os campos, Salve o schema. Campos Faker: Você pode usar diversos tipos de dados Faker: person.fullName, internet.email, number.int, location.streetAddress, phone.number, image.avatar, date.past. Gerar Dados: Após criar um schema, você pode gerar dados fake: GET /api/schema/users?count=10. Relacionamentos: One-to-One, One-to-Many, Many-to-Many. Os relacionamentos permitem criar dados realistas com associações entre entidades.`,
  },
  {
    titleEn: "Authentication",
    titlePt: "Autenticação",
    slug: "/docs/features/authentication",
    sectionEn: "Features",
    sectionPt: "Funcionalidades",
    contentEn: `Add authentication to your mock endpoints. Authentication Types: Mockario supports various authentication types. JWT JSON Web Token: type jwt secret. API Key: type apiKey header X-API-Key. Basic Auth: type basic username password. Bearer Token: type bearer token. Automatic Auth Routes: Mockario automatically creates authentication routes: POST /api/auth/register Create user, POST /api/auth/login Login, GET /api/auth/me Get current user. Manage Users: You can create and manage users through the web interface or API. Security Warning: These are mock endpoints. Do not use in production. Passwords and tokens are stored in a simplified manner.`,
    contentPt: `Adicione autenticação aos seus endpoints mock. Tipos de Autenticação: O Mockario suporta diversos tipos de autenticação. JWT JSON Web Token: type jwt secret. API Key: type apiKey header X-API-Key. Basic Auth: type basic username password. Bearer Token: type bearer token. Rotas de Auth Automáticas: O Mockario cria automaticamente rotas de autenticação: POST /api/auth/register Criar usuário, POST /api/auth/login Fazer login, GET /api/auth/me Obter usuário atual. Gerenciar Usuários: Você pode criar e gerenciar usuários através da interface web ou da API. Aviso de Segurança: Estes são endpoints mock. Não use em produção! As senhas e tokens são armazenados de forma simplificada.`,
  },
  {
    titleEn: "HTTP Client",
    titlePt: "Cliente HTTP",
    slug: "/docs/http-client",
    sectionEn: "HTTP Client",
    sectionPt: "Cliente HTTP",
    contentEn: `Test your endpoints directly in the web interface. What is the HTTP Client? The integrated HTTP Client allows you to test your mock endpoints without leaving the Mockario interface. It is like an integrated Postman or Insomnia. How to Use: Select the HTTP method GET POST PUT DELETE, Enter the endpoint URL, Add headers if needed, Add body for POST PUT PATCH, Click Send, View the response. Select Endpoint: You can select an endpoint from the list to automatically fill URL method and headers. Authentication: Bearer Token for JWT, Basic Auth username and password, API Key in header. History: Your requests are saved in history so you can revisit and run them again. Use history to quickly repeat requests during development.`,
    contentPt: `Teste seus endpoints diretamente na interface web. O que é o HTTP Client? O HTTP Client integrado permite testar seus endpoints mock sem sair da interface do Mockario. É como um Postman ou Insomnia integrado. Como Usar: Selecione o método HTTP GET POST PUT DELETE, Digite a URL do endpoint, Adicione headers se necessário, Adicione body para POST PUT PATCH, Clique em Send, Veja a resposta. Selecionar Endpoint: Você pode selecionar um endpoint da lista para preencher automaticamente URL método e headers. Autenticação: Bearer Token para JWT, Basic Auth username e password, API Key no header. Histórico: Suas requisições são salvas no histórico para que você possa revisitar e executar novamente. Use o histórico para rapidamente repetir requisições durante o desenvolvimento.`,
  },
  {
    titleEn: "API Reference",
    titlePt: "Referência da API",
    slug: "/docs/api-reference",
    sectionEn: "API Reference",
    sectionPt: "Referência da API",
    contentEn: `Complete reference for the Mockario REST API. Base URL: http://localhost:3001/api. Mock Endpoints: GET /mock/endpoints List all endpoints, POST /mock/endpoints Create endpoint, PUT /mock/endpoints/:id Update endpoint, DELETE /mock/endpoints/:id Delete endpoint. Schemas: GET /schemas List schemas, POST /schemas Create schema, GET /schemas/:name/generate Generate data. Logs: GET /logs List request logs, DELETE /logs Clear logs. Users Auth: POST /auth/register Register user, POST /auth/login Login, GET /auth/me Get current user. Status Codes: 200 Success, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error.`,
    contentPt: `Referência completa da API REST do Mockario. Base URL: http://localhost:3001/api. Mock Endpoints: GET /mock/endpoints Listar todos os endpoints, POST /mock/endpoints Criar endpoint, PUT /mock/endpoints/:id Atualizar endpoint, DELETE /mock/endpoints/:id Deletar endpoint. Schemas: GET /schemas Listar schemas, POST /schemas Criar schema, GET /schemas/:name/generate Gerar dados. Logs: GET /logs Listar logs de requisições, DELETE /logs Limpar logs. Usuários Auth: POST /auth/register Registrar usuário, POST /auth/login Login, GET /auth/me Obter usuário atual. Códigos de Status: 200 Sucesso, 201 Criado, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error.`,
  },
  {
    titleEn: "Hooks",
    titlePt: "Hooks",
    slug: "/docs/hooks",
    sectionEn: "Hooks",
    sectionPt: "Hooks",
    contentEn: `Mockario provides React hooks for easy integration with your front-end. useMockEndpoints returns all endpoints and provides create, update, delete functions. useMockServer checks connection status to the mock server. useMockLogs returns request logs. MockarioProvider wraps your app and sets up React Query Client. Example: import { useMockEndpoints } from '@mockario/mockario', const { endpoints, isLoading, create, update, remove } = useMockEndpoints('http://localhost:3001').`,
    contentPt: `O Mockario oferece hooks React para facilitar a integração com sua aplicação front-end. useMockEndpoints retorna todos os endpoints e fornece funções para criar, atualizar e deletar. useMockServer verifica o status da conexão com o servidor mock. useMockLogs retorna os logs de requisições. MockarioProvider envolve sua aplicação e configura o React Query Client. Exemplo: import { useMockEndpoints } from '@mockario/mockario', const { endpoints, isLoading, create, update, remove } = useMockEndpoints('http://localhost:3001').`,
  },
];

export function searchDocs(query: string, locale: string = "en"): DocPage[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return docsPages.filter(page => {
    const title = locale === "pt" ? page.titlePt : page.titleEn;
    const section = locale === "pt" ? page.sectionPt : page.sectionEn;
    const content = locale === "pt" ? page.contentPt : page.contentEn;
    
    const titleMatch = title.toLowerCase().includes(lowerQuery);
    const contentMatch = content.toLowerCase().includes(lowerQuery);
    const sectionMatch = section.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch || sectionMatch;
  });
}

export function getContentSnippet(content: string, query: string, maxLength: number = 150): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);
  
  if (index === -1) {
    return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "");
  }
  
  const start = Math.max(0, index - 40);
  const end = Math.min(content.length, index + query.length + 100);
  
  let snippet = content.slice(start, end);
  
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  
  return snippet;
}

export function getPageContent(page: DocPage, locale: string = "en"): string {
  return locale === "pt" ? page.contentPt : page.contentEn;
}

export function getPageTitle(page: DocPage, locale: string = "en"): string {
  return locale === "pt" ? page.titlePt : page.titleEn;
}

export function getPageSection(page: DocPage, locale: string = "en"): string {
  return locale === "pt" ? page.sectionPt : page.sectionEn;
}
