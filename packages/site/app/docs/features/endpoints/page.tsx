"use client";

import { CodeBlock, Callout, Safari } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function EndpointsPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.endpoints.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.endpoints.description}
      </p>

      <h2>{t.docs.endpoints.createEndpoint}</h2>
      <p>
        {t.docs.endpoints.createViaWeb}
      </p>

      <h3>{t.docs.endpoints.viaWebInterface}</h3>
      <ol>
        <li>{t.docs.endpoints.createViaWeb}</li>
        <li>{t.docs.quickStart.clickNewEndpoint}</li>
        <li>{t.docs.endpoints.defineFields}</li>
        <li>{t.docs.endpoints.saveEndpoint}</li>
      </ol>

      <div className="my-8">
        <Safari imageSrc="/create-endpoint.png" url="mockario.com" />
      </div>

      <h3>{t.docs.endpoints.viaApi}</h3>
      <CodeBlock code={`POST /api/mock/endpoints
{
  "path": "/api/users",
  "method": "GET",
  "response": { "users": [] },
  "statusCode": 200
}`} language="json" />

      <h2>{t.docs.endpoints.supportedMethods}</h2>
      <ul>
        <li><strong>GET</strong> - {t.docs.endpoints.getMethod.replace("GET - ", "")}</li>
        <li><strong>POST</strong> - {t.docs.endpoints.postMethod.replace("POST - ", "")}</li>
        <li><strong>PUT</strong> - {t.docs.endpoints.putMethod.replace("PUT - ", "")}</li>
        <li><strong>DELETE</strong> - {t.docs.endpoints.deleteMethod.replace("DELETE - ", "")}</li>
        <li><strong>PATCH</strong> - {t.docs.endpoints.patchMethod.replace("PATCH - ", "")}</li>
      </ul>

      <h2>{t.docs.endpoints.delay}</h2>
      <p>
        {t.docs.endpoints.addDelay}
      </p>

      <CodeBlock code={`{
  "path": "/api/users",
  "method": "GET",
  "delay": 1000,
  "response": { "users": [] }
}`} language="json" />

      <Callout type="tip">
        {t.docs.endpoints.delayMs}
      </Callout>
    </>
  );
}
