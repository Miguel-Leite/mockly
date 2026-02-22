"use client";

import { CodeBlock, Callout, Safari } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function SchemasPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.schemas.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.schemas.description}
      </p>

      <h2>{t.docs.schemas.whatAreSchemas}</h2>
      <p>
        {t.docs.schemas.schemasDefinition}
      </p>

      <h2>{t.docs.schemas.createSchema}</h2>
      <ol>
        <li>{t.docs.schemas.accessSection}</li>
        <li>{t.docs.schemas.clickNewSchema}</li>
        <li>{t.docs.schemas.defineFields}</li>
        <li>{t.docs.schemas.saveSchema}</li>
      </ol>

      <div className="my-8">
        <Safari imageSrc="/create-schema.png" url="mockario.com" />
      </div>

      <h2>{t.docs.schemas.fakerFields}</h2>
      <p>
        {t.docs.schemas.fakerTypes}
      </p>

      <CodeBlock code={`{
  "name": "person.fullName",
  "email": "internet.email",
  "age": "number.int",
  "address": "location.streetAddress",
  "phone": "phone.number",
  "avatar": "image.avatar",
  "createdAt": "date.past"
}`} language="json" />

      <h2>{t.docs.schemas.generateData}</h2>
      <p>
        {t.docs.schemas.afterCreateSchema}
      </p>

      <CodeBlock code="GET /api/schema/users?count=10" language="bash" />

      <h2>{t.docs.schemas.relationships}</h2>
      <p>
        {t.docs.schemas.createRelationships}
      </p>
      <ul>
        <li>{t.docs.schemas.oneToOne}</li>
        <li>{t.docs.schemas.oneToMany}</li>
        <li>{t.docs.schemas.manyToMany}</li>
      </ul>

      <Callout type="tip">
        {t.docs.schemas.relationshipsTip}
      </Callout>
    </>
  );
}
