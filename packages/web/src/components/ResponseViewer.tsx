import { X, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MockEndpoint } from '@/types';

interface ResponseViewerProps {
  endpoint: MockEndpoint;
  response: object;
  onClose: () => void;
}

export function ResponseViewer({ endpoint, response, onClose }: ResponseViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
              endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
              endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {endpoint.method}
            </span>
            <code className="text-sm text-neutral-300">{endpoint.path}</code>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-auto">
          <pre className="text-sm text-neutral-300 font-mono whitespace-pre-wrap break-all">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

interface ErrorViewerProps {
  endpoint: MockEndpoint;
  error: string;
  onClose: () => void;
}

export function ErrorViewer({ endpoint, error, onClose }: ErrorViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
              endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
              endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {endpoint.method}
            </span>
            <code className="text-sm text-neutral-300">{endpoint.path}</code>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      </div>
    </div>
  );
}
