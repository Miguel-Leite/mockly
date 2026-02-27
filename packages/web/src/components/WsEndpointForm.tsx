import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CreateWsEndpointDto, MockWsEndpoint, WsEventType } from '@/types';

interface WsEndpointFormProps {
  onSubmit: (dto: CreateWsEndpointDto) => void;
  endpoint?: MockWsEndpoint;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WsEndpointForm({ onSubmit, endpoint, trigger, open: externalOpen, onOpenChange }: WsEndpointFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = externalOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  
  const [path, setPath] = useState('');
  const [eventType, setEventType] = useState<WsEventType>('message');
  const [delay, setDelay] = useState('');
  const [response, setResponse] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!endpoint;

  useEffect(() => {
    if (open && endpoint) {
      setPath(endpoint.path || '');
      setEventType(endpoint.eventType || 'message');
      setDelay(endpoint.delay?.toString() || '');
      setResponse(endpoint.response ? JSON.stringify(endpoint.response, null, 2) : '');
      setAuthRequired(endpoint.authRequired || false);
    } else if (open) {
      setPath('');
      setEventType('message');
      setDelay('');
      setResponse('');
      setAuthRequired(false);
    }
  }, [open, endpoint]);

  const handleSubmit = async () => {
    setError('');

    if (!path.trim()) {
      setError('Path is required');
      return;
    }

    let parsedResponse: object | undefined;
    if (response.trim()) {
      try {
        parsedResponse = JSON.parse(response);
      } catch {
        setError('Response must be valid JSON');
        return;
      }
    }

    const dto: CreateWsEndpointDto = {
      path: path.trim(),
      eventType,
      delay: delay ? parseInt(delay) : undefined,
      response: parsedResponse,
      responseType: 'json',
      authRequired,
    };

    onSubmit(dto);
    handleClose();
  };

  const handleClose = () => {
    setPath('');
    setEventType('message');
    setDelay('');
    setResponse('');
    setAuthRequired(false);
    setError('');
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="h-4 w-4" />
      Add WebSocket Endpoint
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit WebSocket Endpoint' : 'Create WebSocket Endpoint'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Path</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/ws/chat"
              className="w-full px-3 py-2 border border-neutral-800 rounded-md bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p className="text-xs text-neutral-400">WebSocket path (e.g., /ws/chat, /ws/notifications)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as WsEventType)}
              className="w-full px-3 py-2 border border-neutral-800 rounded-md bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="message">Message</option>
              <option value="connection">Connection</option>
              <option value="disconnect">Disconnect</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Response (JSON)</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder='{"message": "Hello!", "data": {"id": 1}}'
              rows={5}
              className="w-full px-3 py-2 border border-neutral-800 rounded-md bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-600 font-mono text-sm"
            />
            <p className="text-xs text-neutral-400">Auto-response sent when client connects or sends message</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Delay (ms)</label>
            <input
              type="number"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-neutral-800 rounded-md bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="authRequired"
              checked={authRequired}
              onChange={(e) => setAuthRequired(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-green-600 focus:ring-green-600"
            />
            <label htmlFor="authRequired" className="text-sm">Require Authentication</label>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
