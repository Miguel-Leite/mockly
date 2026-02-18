import { FileText, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RequestLog } from '@/types';

interface LogsViewerProps {
  logs: RequestLog[];
  onClose: () => void;
  onClear: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500/20 text-blue-400',
  POST: 'bg-green-500/20 text-green-400',
  PUT: 'bg-yellow-500/20 text-yellow-400',
  DELETE: 'bg-red-500/20 text-red-400',
};

const statusColors = (status: number) => {
  if (status >= 200 && status < 300) return 'text-green-400';
  if (status >= 400 && status < 500) return 'text-yellow-400';
  if (status >= 500) return 'text-red-400';
  return 'text-neutral-400';
};

export function LogsViewer({ logs, onClose, onClear }: LogsViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-neutral-400" />
            <h3 className="font-semibold">Request Logs</h3>
            <span className="text-xs text-neutral-500">({logs.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No requests yet</p>
              <p className="text-xs mt-1">Make a request to an endpoint to see logs here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice().reverse().map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                >
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${methodColors[log.method]}`}>
                    {log.method}
                  </span>
                  <code className="text-sm text-neutral-300 flex-1 truncate">{log.path}</code>
                  <span className={`text-sm font-medium ${statusColors(log.status)}`}>
                    {log.status < 400 ? (
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 inline mr-1" />
                    )}
                    {log.status}
                  </span>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {log.responseTime}ms
                  </span>
                  <span className="text-xs text-neutral-600">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
