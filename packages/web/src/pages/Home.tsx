import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { EndpointCard } from '@/components/EndpointCard';
import { EndpointForm } from '@/components/EndpointForm';
import { ResponseViewer, ErrorViewer } from '@/components/ResponseViewer';
import { endpointsApi } from '@/services/api';
import type { MockEndpoint, CreateEndpointDto } from '@/types';

export function Home() {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  const handleCreate = async (dto: CreateEndpointDto) => {
    try {
      await endpointsApi.create(dto);
      await fetchEndpoints();
    } catch (err) {
      console.error('Failed to create endpoint:', err);
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

  const handleTest = (endpoint: MockEndpoint, response: object) => {
    setSelectedResponse({ endpoint, response });
  };

  const handleTestError = (endpoint: MockEndpoint, error: string) => {
    setErrorResponse({ endpoint, error });
  };

  const handleTestCard = (endpoint: MockEndpoint, response: object) => {
    handleTest(endpoint, response);
  };

  const handleTestErrorCard = (endpoint: MockEndpoint, error: string) => {
    handleTestError(endpoint, error);
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
          <EndpointForm onSubmit={handleCreate} />
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
                onTest={handleTestCard}
                onTestError={handleTestErrorCard}
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
      </main>
    </div>
  );
}
