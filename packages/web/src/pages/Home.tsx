import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Database } from 'lucide-react';
import { Header } from '@/components/Header';
import { EndpointCard } from '@/components/EndpointCard';
import { EndpointForm } from '@/components/EndpointForm';
import { ResponseViewer, ErrorViewer } from '@/components/ResponseViewer';
import { LogsViewer } from '@/components/LogsViewer';
import { Toaster } from '@/components/ui/toaster';
import { endpointsApi, logsApi } from '@/services/api';
import { toastError, toastSuccess } from '@/lib/toast';
import type { MockEndpoint, CreateEndpointDto, RequestLog } from '@/types';
import { Button } from '@/components/ui/button';

export function Home() {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<{ endpoint: MockEndpoint; response: object } | null>(null);
  const [errorResponse, setErrorResponse] = useState<{ endpoint: MockEndpoint; error: string } | null>(null);
  const [serverConnected, setServerConnected] = useState(true);

  const fetchEndpoints = useCallback(async () => {
    try {
      const data = await endpointsApi.getAll();
      setEndpoints(data);
      if (!serverConnected) {
        setServerConnected(true);
      }
    } catch (err) {
      console.error('Failed to fetch endpoints:', err);
      if (serverConnected) {
        setServerConnected(false);
        toastError('Server disconnected', 'Unable to connect to mock server');
      }
    } finally {
      setLoading(false);
    }
  }, [serverConnected]);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await logsApi.getAll();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
    fetchLogs();

    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [fetchEndpoints, fetchLogs]);

  const handleCreate = async (dto: CreateEndpointDto) => {
    try {
      await endpointsApi.create(dto);
      await fetchEndpoints();
      toastSuccess('Endpoint created', `Created ${dto.method} ${dto.path}`);
    } catch (err) {
      console.error('Failed to create endpoint:', err);
      toastError('Failed to create endpoint', 'Please try again');
    }
  };

  const handleUpdate = async (id: string, dto: Partial<CreateEndpointDto>) => {
    try {
      await endpointsApi.update(id, dto);
      await fetchEndpoints();
      toastSuccess('Endpoint updated', 'Changes saved successfully');
    } catch (err) {
      console.error('Failed to update endpoint:', err);
      toastError('Failed to update endpoint', 'Please try again');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpointsApi.delete(id);
      setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
      toastSuccess('Endpoint deleted', 'Endpoint removed successfully');
    } catch (err) {
      console.error('Failed to delete endpoint:', err);
      toastError('Failed to delete endpoint', 'Please try again');
    }
  };

  const handleClearLogs = async () => {
    try {
      await logsApi.clear();
      setLogs([]);
      toastSuccess('Logs cleared', 'All logs have been cleared');
    } catch (err) {
      console.error('Failed to clear logs:', err);
      toastError('Failed to clear logs', 'Please try again');
    }
  };

  const handleTest = (endpoint: MockEndpoint, response: object) => {
    setSelectedResponse({ endpoint, response });
  };

  const handleTestError = (endpoint: MockEndpoint, error: string) => {
    setErrorResponse({ endpoint, error });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header serverConnected={serverConnected} />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Endpoints</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/schemas">
              <Button variant="outline" size="sm" className="gap-2">
                <Database className="h-4 w-4" />
                Diagrams
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowLogs(true)}
            >
              <FileText className="h-4 w-4" />
              Logs
              {logs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-600 rounded-full">
                  {logs.length}
                </span>
              )}
            </Button>
            <EndpointForm onSubmit={handleCreate} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !serverConnected ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Unable to connect to server</p>
            <p className="text-sm text-neutral-600">Make sure the mock server is running on localhost:3001</p>
          </div>
        ) : endpoints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No endpoints configured yet</p>
            <p className="text-sm text-neutral-600">Create your first mock endpoint to get started</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {endpoints.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onTest={handleTest}
                onTestError={handleTestError}
              />
            ))}
          </div>
        )}

        {selectedResponse && (
          <ResponseViewer
            endpoint={selectedResponse.endpoint}
            response={selectedResponse.response}
            onClose={() => setSelectedResponse(null)}
          />
        )}

        {errorResponse && (
          <ErrorViewer
            endpoint={errorResponse.endpoint}
            error={errorResponse.error}
            onClose={() => setErrorResponse(null)}
          />
        )}

        {showLogs && (
          <LogsViewer
            logs={logs}
            onClose={() => setShowLogs(false)}
            onClear={handleClearLogs}
          />
        )}
      </main>
      <Toaster />
    </div>
  );
}
