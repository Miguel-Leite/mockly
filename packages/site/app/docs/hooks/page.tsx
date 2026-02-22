"use client";

import { CodeBlock, Callout } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function HooksPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.hooks.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.hooks.description}
      </p>

      <h2>{t.docs.hooks.quickIntro}</h2>
      <p>
        {t.docs.hooks.quickIntroDesc}
      </p>

      <h2>{t.docs.hooks.provider}</h2>
      <p>
        {t.docs.hooks.providerDesc}
      </p>

      <CodeBlock code={`import { MockarioProvider } from '@mockario/mockario';

function App() {
  return (
    <MockarioProvider>
      <YourApp />
    </MockarioProvider>
  );
}`} language="tsx" />

      <h2>useMockEndpoints</h2>
      <p>
        {t.docs.hooks.useMockEndpointsDesc}
      </p>

      <CodeBlock code={`import { useMockEndpoints } from '@mockario/mockario';

function EndpointsList() {
  const { 
    endpoints, 
    isLoading, 
    isFetching,
    error,
    refetch,
    create,
    update,
    remove 
  } = useMockEndpoints('http://localhost:3001');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refetch</button>
      {endpoints.map(endpoint => (
        <div key={endpoint.id}>{endpoint.path}</div>
      ))}
    </div>
  );
}`} language="tsx" />

      <h3>{t.docs.hooks.returnValues}</h3>
      <ul>
        <li><code>endpoints</code> - {t.docs.hooks.endpointsArray}</li>
        <li><code>isLoading</code> - {t.docs.hooks.isLoading}</li>
        <li><code>isFetching</code> - {t.docs.hooks.isFetching}</li>
        <li><code>error</code> - {t.docs.hooks.error}</li>
        <li><code>refetch</code> - {t.docs.hooks.refetch}</li>
        <li><code>create(dto)</code> - {t.docs.hooks.createEndpoint}</li>
        <li><code>update(id, dto)</code> - {t.docs.hooks.updateEndpoint}</li>
        <li><code>remove(id)</code> - {t.docs.hooks.deleteEndpoint}</li>
      </ul>

      <h2>useMockServer</h2>
      <p>
        {t.docs.hooks.useMockServerDesc}
      </p>

      <CodeBlock code={`import { useMockServer } from '@mockario/mockario';

function ServerStatus() {
  const { 
    isConnected, 
    isChecking,
    serverUrl,
    port,
    error,
    refetch 
  } = useMockServer('http://localhost:3001');

  if (isChecking) return <div>Checking connection...</div>;

  return (
    <div>
      <p>Server: {serverUrl}</p>
      <p>Port: {port}</p>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {error && <p>Error: {error.message}</p>}
      <button onClick={refetch}>Check Again</button>
    </div>
  );
}`} language="tsx" />

      <h3>{t.docs.hooks.returnValues}</h3>
      <ul>
        <li><code>isConnected</code> - {t.docs.hooks.isConnected}</li>
        <li><code>isChecking</code> - {t.docs.hooks.isChecking}</li>
        <li><code>serverUrl</code> - {t.docs.hooks.serverUrl}</li>
        <li><code>port</code> - {t.docs.hooks.port}</li>
        <li><code>error</code> - {t.docs.hooks.error}</li>
        <li><code>refetch()</code> - {t.docs.hooks.checkAgain}</li>
      </ul>

      <h2>useMockLogs</h2>
      <p>
        {t.docs.hooks.useMockLogsDesc}
      </p>

      <CodeBlock code={`import { useMockLogs } from '@mockario/mockario';

function RequestLogs() {
  const { logs, isLoading, clearLogs } = useMockLogs('http://localhost:3001');

  return (
    <div>
      <button onClick={clearLogs}>Clear Logs</button>
      {logs.map(log => (
        <div key={log.id}>
          <span>{log.method}</span>
          <span>{log.path}</span>
          <span>{log.statusCode}</span>
        </div>
      ))}
    </div>
  );
}`} language="tsx" />

      <h2>{t.docs.hooks.fullExample}</h2>
      <p>
        {t.docs.hooks.fullExampleDesc}
      </p>

      <CodeBlock code={`import { MockarioProvider, useMockEndpoints, useMockServer } from '@mockario/mockario';

function Dashboard() {
  const { isConnected, serverUrl } = useMockServer('http://localhost:3001');
  const { endpoints, isLoading } = useMockEndpoints('http://localhost:3001');

  return (
    <div>
      <h1>Mockario Dashboard</h1>
      <p>Server: {serverUrl} - {isConnected ? '🟢' : '🔴'}</p>
      
      <h2>Endpoints ({endpoints.length})</h2>
      {isLoading ? (
        <p>Loading endpoints...</p>
      ) : (
        <ul>
          {endpoints.map(ep => (
            <li key={ep.id}>
              <strong>{ep.method}</strong> {ep.path}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <MockarioProvider>
      <Dashboard />
    </MockarioProvider>
  );
}`} language="tsx" />

      <Callout type="tip" title={t.callout.tip}>
        {t.docs.hooks.noteAboutBaseUrl}
      </Callout>
    </>
  );
}
