import { useState } from 'react';
import { Plus, Code } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreateEndpointDto, HttpMethod, MockEndpoint, ResponseType } from '@/types';
import { FakerTemplates } from './FakerTemplates';
import { SchemaSelector } from './SchemaSelector';
import { schemasApi } from '@/services/api';

interface EndpointFormProps {
  onSubmit: (dto: CreateEndpointDto) => void;
  endpoint?: MockEndpoint;
  trigger?: React.ReactNode;
}

const defaultJson = `{
  "message": "Hello World"
}`;

const defaultTs = `"{{faker.name}}"`;

export function EndpointForm({ onSubmit, endpoint, trigger }: EndpointFormProps) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(endpoint?.path || '');
  const [method, setMethod] = useState<HttpMethod>(endpoint?.method || 'GET');
  const [response, setResponse] = useState(endpoint ? JSON.stringify(endpoint.response, null, 2) : defaultJson);
  const [responseType, setResponseType] = useState<ResponseType>(endpoint?.responseType || 'json');
  const [delay, setDelay] = useState(endpoint?.delay?.toString() || '');
  const [count, setCount] = useState(endpoint?.storedData ? String(endpoint.storedData.length) : '1');
  const [schemaId, setSchemaId] = useState(endpoint?.schemaRef?.schemaId || '');
  const [tableId, setTableId] = useState(endpoint?.schemaRef?.tableId || '');
  const [showPayload, setShowPayload] = useState(false);
  const [payload, setPayload] = useState(endpoint?.payloadJson ? JSON.stringify(endpoint.payloadJson, null, 2) : defaultJson);
  const [payloadType, setPayloadType] = useState<ResponseType>(endpoint?.payloadType || 'json');
  const [payloadSchemaId, setPayloadSchemaId] = useState(endpoint?.payloadSchemaRef?.schemaId || '');
  const [payloadTableId, setPayloadTableId] = useState(endpoint?.payloadSchemaRef?.tableId || '');
  const [error, setError] = useState('');

  const isEditing = !!endpoint;

  const handleSubmit = () => {
    setError('');
    
    if (!path.trim()) {
      setError('Path is required');
      return;
    }

    if (!path.startsWith('/')) {
      setError('Path must start with /');
      return;
    }

    let parsedResponse;
    if (responseType === 'json') {
      try {
        parsedResponse = JSON.parse(response);
      } catch {
        setError('Invalid JSON response');
        return;
      }
    } else {
      parsedResponse = response;
    }

    let parsedPayload = undefined;
    if (showPayload && (payloadSchemaId || payload)) {
      if (payloadType === 'json' && payload) {
        try {
          parsedPayload = JSON.parse(payload);
        } catch {
          setError('Invalid JSON payload');
          return;
        }
      } else {
        parsedPayload = payload;
      }
    }

    const dto: CreateEndpointDto = {
      path: path.trim(),
      method,
      response: parsedResponse,
      responseType,
      delay: delay ? parseInt(delay) : undefined,
      ...(schemaId && tableId ? { schemaRef: { schemaId, tableId } } : {}),
      ...(parsedPayload ? { payloadJson: parsedPayload } : {}),
      ...(payloadSchemaId && payloadTableId ? { payloadSchemaRef: { schemaId: payloadSchemaId, tableId: payloadTableId } } : {}),
      ...(showPayload ? { payloadType } : {}),
    };

    onSubmit(dto);
    if (!isEditing) {
      handleClose();
    }
  };

  const handleClose = () => {
    setPath('');
    setMethod('GET');
    setResponse(defaultJson);
    setResponseType('json');
    setDelay('');
    setCount('1');
    setSchemaId('');
    setTableId('');
    setShowPayload(false);
    setPayload(defaultJson);
    setPayloadType('json');
    setPayloadSchemaId('');
    setPayloadTableId('');
    setError('');
    setOpen(false);
  };

  const handleInsertTemplate = (template: string) => {
    if (responseType === 'json') {
      setResponse(prev => {
        try {
          const parsed = JSON.parse(prev);
          const key = Object.keys(parsed)[0] || 'field';
          parsed[key] = template;
          return JSON.stringify(parsed, null, 2);
        } catch {
          return prev;
        }
      });
    } else {
      setResponse(template.replace('{{faker.', '').replace('}}', '').trim());
    }
  };

  const handleSchemaSelect = async (newSchemaId: string, newTableId: string) => {
    setSchemaId(newSchemaId);
    setTableId(newTableId);

    if (newSchemaId && newTableId) {
      try {
        const numCount = parseInt(count) || 1;
        const data = await schemasApi.generateFromTable(newSchemaId, newTableId, numCount);
        setResponse(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('Failed to generate from schema:', err);
      }
    }
  };

  const handlePayloadSchemaSelect = async (newSchemaId: string, newTableId: string) => {
    setPayloadSchemaId(newSchemaId);
    setPayloadTableId(newTableId);

    if (newSchemaId && newTableId) {
      try {
        const data = await schemasApi.generateFromTable(newSchemaId, newTableId, 1);
        setPayload(JSON.stringify(data[0], null, 2));
      } catch (err) {
        console.error('Failed to generate from schema:', err);
      }
    }
  };

  const dialogContent = (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Endpoint' : 'Create New Endpoint'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="col-span-1 h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/api/users"
            className="col-span-3 h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Response</label>
              <select
                value={responseType}
                onChange={(e) => {
                  setResponseType(e.target.value as ResponseType);
                  setResponse(e.target.value === 'ts' ? defaultTs : defaultJson);
                }}
                className="h-6 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
              >
                <option value="json">JSON</option>
                <option value="ts">TS/Faker</option>
              </select>
              {method === 'GET' && (
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="Count"
                  min="1"
                  max="100"
                  className="h-6 w-16 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
                  title="Number of records to generate"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <SchemaSelector
                onSelect={handleSchemaSelect}
                selectedSchemaId={schemaId}
                selectedTableId={tableId}
              />
              {responseType === 'json' && (
                <FakerTemplates onInsert={handleInsertTemplate} />
              )}
            </div>
          </div>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={responseType === 'ts' ? 3 : 8}
            placeholder={responseType === 'ts' ? '{{faker.name}}' : '{"key": "value"}'}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 font-mono placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
          />
        </div>

        <div className="border-t border-neutral-800 pt-4">
          <button
            type="button"
            onClick={() => setShowPayload(!showPayload)}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
          >
            <Code className="h-4 w-4" />
            Payload Validation (Optional)
            {showPayload ? ' ▲' : ' ▼'}
          </button>
          
          {showPayload && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Type:</span>
                <select
                  value={payloadType}
                  onChange={(e) => {
                    setPayloadType(e.target.value as ResponseType);
                    setPayload(e.target.value === 'ts' ? defaultTs : defaultJson);
                  }}
                  className="h-7 text-xs rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-300"
                >
                  <option value="json">JSON Schema</option>
                  <option value="ts">Schema Reference</option>
                </select>
                
                {payloadType === 'ts' && (
                  <SchemaSelector
                    onSelect={handlePayloadSchemaSelect}
                    selectedSchemaId={payloadSchemaId}
                    selectedTableId={payloadTableId}
                  />
                )}
              </div>
              
              {payloadType === 'json' && (
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={4}
                  placeholder='{"email": {"required": true}, "name": {"required": true}}'
                  className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 font-mono placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                />
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Delay (ms) - Optional</label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            placeholder="0"
            min="0"
            max="30000"
            className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={isEditing ? () => {} : handleClose}>
            {isEditing ? 'Close' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Endpoint
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
