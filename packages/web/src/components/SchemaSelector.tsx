import { useState, useEffect } from 'react';
import { Database, Table2, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schemasApi } from '@/services/api';
import type { Schema } from '@/types';

interface SchemaSelectorProps {
  onSelect: (schemaId: string, tableId: string) => void;
  selectedSchemaId?: string;
  selectedTableId?: string;
}

export function SchemaSelector({ onSelect, selectedSchemaId, selectedTableId }: SchemaSelectorProps) {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  useEffect(() => {
    schemasApi.getAll()
      .then(setSchemas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectedSchema = schemas.find(s => s.id === selectedSchemaId);
  const selectedTable = selectedSchema?.tables.find(t => t.id === selectedTableId);

  const handleSchemaSelect = (schemaId: string) => {
    setSchemaOpen(false);
    const schema = schemas.find(s => s.id === schemaId);
    if (schema && schema.tables.length > 0) {
      onSelect(schemaId, schema.tables[0].id);
    } else if (schema) {
      onSelect(schemaId, '');
    }
  };

  const handleTableSelect = (tableId: string) => {
    setTableOpen(false);
    if (selectedSchemaId) {
      onSelect(selectedSchemaId, tableId);
    }
  };

  const handleGenerate = () => {
    if (selectedSchemaId && selectedTableId) {
      onSelect(selectedSchemaId, selectedTableId);
    }
  };

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="h-7 gap-1">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (schemas.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="h-7 gap-1 text-neutral-500">
        <Database className="h-3 w-3" />
        No schemas
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-neutral-400"
          onClick={() => setSchemaOpen(!schemaOpen)}
        >
          <Database className="h-3 w-3" />
          {selectedSchema?.name || 'Select Schema'}
          <ChevronDown className="h-3 w-3" />
        </Button>

        {schemaOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSchemaOpen(false)} />
            <div className="absolute left-0 top-full mt-1 z-50 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg py-1 max-h-60 overflow-auto">
              {schemas.map(schema => (
                <button
                  key={schema.id}
                  className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 hover:text-primary-400"
                  onClick={() => handleSchemaSelect(schema.id)}
                >
                  {schema.name} ({schema.tables.length} tables)
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedSchema && selectedSchema.tables.length > 0 && (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-neutral-400"
            onClick={() => setTableOpen(!tableOpen)}
          >
            <Table2 className="h-3 w-3" />
            {selectedTable?.name || 'Select Table'}
            <ChevronDown className="h-3 w-3" />
          </Button>

          {tableOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTableOpen(false)} />
              <div className="absolute left-0 top-full mt-1 z-50 w-40 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg py-1 max-h-60 overflow-auto">
                {selectedSchema.tables.map(table => (
                  <button
                    key={table.id}
                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 hover:text-primary-400"
                    onClick={() => handleTableSelect(table.id)}
                  >
                    {table.name} ({table.fields.length} fields)
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {selectedSchemaId && selectedTableId && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleGenerate}
          title="Generate from schema"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
