"use client";

import { CodeBlock, Callout, Safari } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function QuickStartPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.quickStart.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.quickStart.description}
      </p>

      <h2>{t.docs.quickStart.startServer}</h2>
      <p>{t.docs.quickStart.runCommand}</p>

      <CodeBlock code="npx mockario start" language="bash" />

      <Callout type="info">
        {t.docs.quickStart.thisCommandWillStart}
        <ul className="mt-2 list-disc list-inside">
          <li>{t.docs.quickStart.mockServerPort}</li>
          <li>{t.docs.quickStart.webInterfacePort}</li>
          <li>{t.docs.quickStart.autoOpenBrowser}</li>
        </ul>
      </Callout>

      <h2>{t.docs.quickStart.createFirstEndpoint}</h2>
      <ol>
        <li>{t.docs.quickStart.accessWebInterface}</li>
        <li>{t.docs.quickStart.clickNewEndpoint}</li>
        <li>{t.docs.quickStart.fillFields}</li>
        <ul>
          <li><strong>{t.docs.quickStart.path}:</strong> /api/users</li>
          <li><strong>{t.docs.quickStart.method}:</strong> GET</li>
          <li><strong>{t.docs.quickStart.response}:</strong> {"{ \"users\": [] }"}</li>
        </ul>
        <li>{t.docs.quickStart.clickSave}</li>
      </ol>

      <div className="my-8">
        <Safari imageSrc="/list-endpoints.png" url="localhost:3001" />
      </div>

      <h2>{t.docs.quickStart.testEndpoint}</h2>
      <p>{t.docs.quickStart.nowYouCanTest}</p>

      <CodeBlock code="curl http://localhost:3001/api/users" language="bash" />

      <h2>{t.docs.quickStart.nextSteps}</h2>
      <p>
        {t.docs.quickStart.exploreMore}
      </p>
      <ul>
        <li><a href="/docs/features/endpoints">{t.docs.quickStart.learnMoreEndpoints}</a></li>
        <li><a href="/docs/features/schemas">{t.docs.quickStart.createDataSchemas}</a></li>
        <li><a href="/docs/features/authentication">{t.docs.quickStart.addAuthEndpoints}</a></li>
      </ul>
    </>
  );
}
