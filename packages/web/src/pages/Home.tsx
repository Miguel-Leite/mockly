import { useState, useEffect, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { Header } from '@/components/Header';
import { EndpointCard } from '@/components/EndpointCard';
import { EndpointForm } from '@/components/EndpointForm';
import { ResponseViewer, ErrorViewer } from '@/components/ResponseViewer';
import { LogsViewer } from '@/components/LogsViewer';
import { endpointsApi, logsApi } from '@/services/api';
import type { MockEndpoint, CreateEndpointDto, RequestLog } from '@/types';
import { Button } from '@/components/ui/button';

export function Home() {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<{ endpoint: MockEndpoint; response: object } | null>(null);
  const [errorResponse, setErrorResponse] = useState<{ endpoint: MockEndpoint; error: string } | null>(null);

  const fetchEndpoints = useCallback(async () => {
    try {
      const data = await endpointsApi.getAll();
      setEndpoints(data);
    } catch (err) {
      console.error('Failed to fetch endpoints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
    } catch (err) {
      console.error('Failed to create endpoint:', err);
    }
  };

  const handleUpdate = async (id: string, dto: Partial<CreateEndpointDto>) => {
    try {
      await endpointsApi.update(id, dto);
      await fetchEndpoints();
    } catch (err) {
      console.error('Failed to update endpoint:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await endpointsApi.delete(id);
      setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
    } catch (err) {
      console.error('Failed to delete endpoint:', err);
    }
  };

  const handleClearLogs = async () => {
    try {
      await logsApi.clear();
      setLogs([]);
    } catch (err) {
      console.error('Failed to clear logs:', err);
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
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Endpoints</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <div className="flex items-center gap-2">
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
    </div>
  );
}
