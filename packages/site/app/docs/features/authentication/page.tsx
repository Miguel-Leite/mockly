"use client";

import { CodeBlock, Callout, Safari } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function AuthenticationPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.authentication.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.authentication.description}
      </p>

      <h2>{t.docs.authentication.authTypes}</h2>
      <p>
        {t.docs.authentication.mockarioSupports}
      </p>

      <h3>{t.docs.authentication.jwt}</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "jwt",
    "secret": "your-secret-key"
  }
}`} language="json" />

      <h3>{t.docs.authentication.apiKey}</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "apiKey",
    "header": "X-API-Key",
    "key": "your-api-key"
  }
}`} language="json" />

      <h3>{t.docs.authentication.basicAuth}</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "basic",
    "username": "admin",
    "password": "password"
  }
}`} language="json" />

      <h3>{t.docs.authentication.bearerToken}</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "bearer",
    "token": "your-bearer-token"
  }
}`} language="json" />

      <h2>{t.docs.authentication.automaticAuthRoutes}</h2>
      <p>
        {t.docs.authentication.autoRoutes}
      </p>
      <ul>
        <li><code>POST /api/auth/register</code> - {t.docs.authentication.register.replace("POST /api/auth/register - ", "")}</li>
        <li><code>POST /api/auth/login</code> - {t.docs.authentication.login.replace("POST /api/auth/login - ", "")}</li>
        <li><code>GET /api/auth/me</code> - {t.docs.authentication.getMe.replace("GET /api/auth/me - ", "")}</li>
      </ul>

      <h2>{t.docs.authentication.manageUsers}</h2>
      <p>
        {t.docs.authentication.manageUsersDesc}
      </p>

      <div className="my-8">
        <Safari imageSrc="/config-auth-enabled.png" url="mockario.com" />
      </div>

      <Callout type="warning" title={t.docs.authentication.securityWarning}>
        {t.docs.authentication.securityNote}
      </Callout>
    </>
  );
}
