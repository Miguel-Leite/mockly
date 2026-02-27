import { useState, useEffect, useCallback } from 'react';
import { Wifi, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { WsEndpointCard } from '@/components/WsEndpointCard';
import { WsEndpointForm } from '@/components/WsEndpointForm';
import { wsEndpointsApi } from '@/services/api';
import { toastError, toastSuccess } from '@/lib/toast';
import type { MockWsEndpoint, CreateWsEndpointDto } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function WebSockets() {
  const [endpoints, setEndpoints] = useState<MockWsEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<MockWsEndpoint | null>(null);
  const [endpointToDelete, setEndpointToDelete] = useState<MockWsEndpoint | null>(null);

  const fetchEndpoints = useCallback(async () => {
    try {
      const data = await wsEndpointsApi.getAll();
      setEndpoints(data);
      setError(null);
    } catch (err) {
      setError('Failed to load WebSocket endpoints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  const handleCreate = async (dto: CreateWsEndpointDto) => {
    try {
      await wsEndpointsApi.create(dto);
      toastSuccess('WebSocket endpoint created');
      fetchEndpoints();
    } catch (err) {
      toastError('Failed to create endpoint');
    }
  };

  const handleUpdate = async (id: string, dto: Partial<CreateWsEndpointDto>) => {
    try {
      await wsEndpointsApi.update(id, dto);
      toastSuccess('WebSocket endpoint updated');
      fetchEndpoints();
    } catch (err) {
      toastError('Failed to update endpoint');
    }
  };

  const handleDelete = async (id: string) => {
    const endpoint = endpoints.find(ep => ep.id === id);
    if (endpoint) {
      setEndpointToDelete(endpoint);
    }
  };

  const handleConfirmDelete = async () => {
    if (!endpointToDelete) return;
    
    try {
      await wsEndpointsApi.delete(endpointToDelete.id);
      toastSuccess('WebSocket endpoint deleted');
      fetchEndpoints();
    } catch (err) {
      toastError('Failed to delete endpoint');
    } finally {
      setEndpointToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-600/10">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">WebSocket Endpoints</h1>
              <p className="text-sm text-neutral-400">Manage WebSocket mock endpoints</p>
            </div>
          </div>
          <WsEndpointForm onSubmit={handleCreate} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-neutral-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : endpoints.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-800 rounded-lg">
            <Wifi className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-300 mb-2">No WebSocket endpoints</h3>
            <p className="text-neutral-500 mb-4">Create your first WebSocket endpoint to get started</p>
            <WsEndpointForm onSubmit={handleCreate} />
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {endpoints.map((endpoint) => (
                <WsEndpointCard
                  key={endpoint.id}
                  endpoint={endpoint}
                  onEdit={() => setEditingEndpoint(endpoint)}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {editingEndpoint && (
              <WsEndpointForm
                endpoint={editingEndpoint}
                onSubmit={(dto) => {
                  handleUpdate(editingEndpoint.id, dto);
                  setEditingEndpoint(null);
                }}
                trigger={<></>}
                open={true}
                onOpenChange={(open) => !open && setEditingEndpoint(null)}
              />
            )}
          </>
        )}

        <div className="mt-8 p-4 rounded-lg bg-neutral-900 border border-neutral-800">
          <h3 className="font-medium text-neutral-100 mb-2">How to use</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Connect to WebSocket endpoints using the following URL format:
          </p>
          <code className="block p-3 rounded bg-neutral-800 text-green-400 text-sm font-mono">
            ws://localhost:3001{endpoints[0]?.path || '/ws/your-endpoint'}
          </code>
        </div>

        <AlertDialog open={!!endpointToDelete} onOpenChange={(open) => !open && setEndpointToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete WebSocket Endpoint</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {endpointToDelete?.path}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEndpointToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
