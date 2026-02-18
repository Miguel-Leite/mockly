import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreateEndpointDto, HttpMethod, MockEndpoint } from '@/types';
import { FakerTemplates } from './FakerTemplates';

interface EndpointFormProps {
  onSubmit: (dto: CreateEndpointDto) => void;
  endpoint?: MockEndpoint;
  trigger?: React.ReactNode;
}

const defaultJson = `{
  "message": "Hello World"
}`;

export function EndpointForm({ onSubmit, endpoint, trigger }: EndpointFormProps) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(endpoint?.path || '');
  const [method, setMethod] = useState<HttpMethod>(endpoint?.method || 'GET');
  const [response, setResponse] = useState(endpoint ? JSON.stringify(endpoint.response, null, 2) : defaultJson);
  const [delay, setDelay] = useState(endpoint?.delay?.toString() || '');
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
    try {
      parsedResponse = JSON.parse(response);
    } catch {
      setError('Invalid JSON response');
      return;
    }

    const dto: CreateEndpointDto = {
      path: path.trim(),
      method,
      response: parsedResponse,
      delay: delay ? parseInt(delay) : undefined,
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
    setDelay('');
    setError('');
    setOpen(false);
  };

  const handleInsertTemplate = (template: string) => {
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
  };

  const dialogContent = (
    <DialogContent className="max-w-lg">
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
            <label className="text-xs text-neutral-400">Response (JSON)</label>
            <FakerTemplates onInsert={handleInsertTemplate} />
          </div>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 font-mono placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
          />
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
