import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Plus, Trash2, Table2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { schemasApi } from '@/services/api';
import { toastError, toastSuccess } from '@/lib/toast';
import type { Schema } from '@/types';
import { Toaster } from '@/components/ui/toaster';

export function Schemas() {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverConnected, setServerConnected] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState('');
  const navigate = useNavigate();

  const fetchSchemas = useCallback(async () => {
    try {
      const data = await schemasApi.getAll();
      setSchemas(data);
      if (!serverConnected) {
        setServerConnected(true);
      }
    } catch (err) {
      console.error('Failed to fetch schemas:', err);
      if (serverConnected) {
        setServerConnected(false);
        toastError('Server disconnected', 'Unable to connect to mock server');
      }
    } finally {
      setLoading(false);
    }
  }, [serverConnected]);

  useEffect(() => {
    fetchSchemas();
  }, [fetchSchemas]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchemaName.trim()) return;

    try {
      await schemasApi.create(newSchemaName.trim());
      await fetchSchemas();
      setShowCreateModal(false);
      setNewSchemaName('');
      toastSuccess('Schema created', `Created "${newSchemaName}" schema`);
    } catch (err) {
      console.error('Failed to create schema:', err);
      toastError('Failed to create schema', 'Please try again');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete schema "${name}"? This action cannot be undone.`)) return;

    try {
      await schemasApi.delete(id);
      setSchemas(prev => prev.filter(s => s.id !== id));
      toastSuccess('Schema deleted', 'Schema removed successfully');
    } catch (err) {
      console.error('Failed to delete schema:', err);
      toastError('Failed to delete schema', 'Please try again');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header serverConnected={serverConnected} />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Schemas</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {schemas.length} schema{schemas.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Schema
          </Button>
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
        ) : schemas.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 mb-4">No schemas created yet</p>
            <p className="text-sm text-neutral-600 mb-6">Create your first schema to define data models</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schema
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schemas.map((schema) => (
              <div
                key={schema.id}
                className="group relative bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-800 rounded-lg">
                      <Database className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{schema.name}</h3>
                      <p className="text-sm text-neutral-500">
                        {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(schema.id, schema.name)}
                  >
                    <Trash2 className="h-4 w-4 text-neutral-500 hover:text-red-400" />
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {schema.tables.slice(0, 4).map((table) => (
                    <span
                      key={table.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-neutral-800 text-neutral-400 rounded"
                    >
                      <Table2 className="h-3 w-3" />
                      {table.name}
                    </span>
                  ))}
                  {schema.tables.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-neutral-500">
                      +{schema.tables.length - 4} more
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 group-hover:bg-neutral-800 transition-colors"
                  onClick={() => navigate(`/schemas/${schema.id}`)}
                >
                  Open Editor
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-semibold mb-4">Create New Schema</h3>
              <form onSubmit={handleCreate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">
                    Schema Name
                  </label>
                  <input
                    type="text"
                    value={newSchemaName}
                    onChange={(e) => setNewSchemaName(e.target.value)}
                    placeholder="e.g., E-commerce, Blog, CRM"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!newSchemaName.trim()}>
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
