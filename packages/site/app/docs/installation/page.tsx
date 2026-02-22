"use client";

import { CodeBlock, Callout } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function InstallationPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.installation.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.installation.description}
      </p>

      <h2>{t.docs.installation.requirements}</h2>
      <ul>
        <li>{t.docs.installation.nodejs}</li>
        <li>{t.docs.installation.npm}</li>
      </ul>

      <h2>{t.docs.installation.installation}</h2>
      <p>
        {t.docs.installation.installGlobal}
      </p>

      <CodeBlock code="npm install -g @mockario/mockario" language="bash" />

      <p>{t.docs.installation.orUseNpx}</p>

      <CodeBlock code="npx @mockario/mockario --version" language="bash" />

      <Callout type="note">
        {t.docs.installation.recommendNpx}
      </Callout>

      <h2>{t.docs.installation.verification}</h2>
      <p>{t.docs.installation.verifyInstall}</p>

      <CodeBlock code="npx @mockario/mockario --help" language="bash" />

      <h2>{t.docs.installation.nextSteps}</h2>
      <p>
        {t.docs.installation.nowInstalled}{" "}
        <a href="/docs/quick-start">
          {t.docs.quickStart.title}
        </a>{" "}
        {t.docs.installation.toCreateFirst}
      </p>
    </>
  );
}
