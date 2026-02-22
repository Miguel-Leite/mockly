"use client";

import { Callout, Safari } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function HttpClientPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.httpClient.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.httpClient.description}
      </p>

      <h2>{t.docs.httpClient.whatIsHttpClient}</h2>
      <p>
        {t.docs.httpClient.httpClientDesc}
      </p>

      <h2>{t.docs.httpClient.howToUse}</h2>
      <ol>
        <li>{t.docs.httpClient.howToUse}</li>
        <li>{t.docs.httpClient.selectHttpMethod}</li>
        <li>{t.docs.httpClient.enterUrl}</li>
        <li>{t.docs.httpClient.addHeaders}</li>
        <li>{t.docs.httpClient.addBody}</li>
        <li>{t.docs.httpClient.clickSend}</li>
        <li>{t.docs.httpClient.viewResponse}</li>
      </ol>

      <div className="my-8">
        <Safari imageSrc="/http-client.png" url="mockario.com" />
      </div>

      <h2>{t.docs.httpClient.selectEndpoint}</h2>
      <p>
        {t.docs.httpClient.selectEndpointDesc}
      </p>
      <ul>
        <li>{t.docs.httpClient.clickSelector}</li>
        <li>{t.docs.httpClient.chooseEndpoint}</li>
        <li>{t.docs.httpClient.fieldsAutoFill}</li>
      </ul>

      <h2>{t.docs.httpClient.auth}</h2>
      <p>
        {t.docs.httpClient.authSupport}
      </p>
      <ul>
        <li><strong>{t.docs.httpClient.bearerToken}</strong></li>
        <li><strong>{t.docs.httpClient.basicAuth}</strong></li>
        <li><strong>{t.docs.httpClient.apiKey}</strong></li>
      </ul>

      <h2>{t.docs.httpClient.history}</h2>
      <p>
        {t.docs.httpClient.historyDesc}
      </p>

      <Callout type="tip">
        {t.docs.httpClient.historyTip}
      </Callout>
    </>
  );
}
