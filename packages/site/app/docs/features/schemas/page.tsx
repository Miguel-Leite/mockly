export default function SchemasPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Schemas</h1>
      <p className="text-lg text-muted-foreground">
        Crie schemas e gere dados fake automaticamente.
      </p>

      <h2>O que são Schemas?</h2>
      <p>
        Schemas são definições de estrutura de dados que permitem gerar 
        dados fake automaticamente usando Faker.
      </p>

      <h2>Criar um Schema</h2>
      <ol>
        <li>Acesse a seção "Schemas" na interface web</li>
        <li>Clique em "New Schema"</li>
        <li>Defina o nome e os campos</li>
        <li>Salve o schema</li>
      </ol>

      <h2>Campos Faker</h2>
      <p>
        Você pode usar diversos tipos de dados Faker:
      </p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "name": "person.fullName",
  "email": "internet.email",
  "age": "number.int",
  "address": "location.streetAddress",
  "phone": "phone.number",
  "avatar": "image.avatar",
  "createdAt": "date.past"
}`}</code>
      </pre>

      <h2>Gerar Dados</h2>
      <p>
        Após criar um schema, você pode gerar dados fake:
      </p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>GET /api/schema/users?count=10</code>
      </pre>

      <h2>Relacionamentos</h2>
      <p>
        Você pode criar relacionamentos entre schemas:
      </p>
      <ul>
        <li>One-to-One</li>
        <li>One-to-Many</li>
        <li>Many-to-Many</li>
      </ul>
    </div>
  );
}
