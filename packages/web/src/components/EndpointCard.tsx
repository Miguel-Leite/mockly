import { useState } from 'react';
import { Trash2, Play, Copy, Check } from 'lucide-react';
import type { MockEndpoint } from '@/types';
import { Button } from '@/components/ui/button';
import { testEndpoint } from '@/services/api';

interface EndpointCardProps {
  endpoint: MockEndpoint;
  onDelete: (id: string) => void;
  onTest: (endpoint: MockEndpoint, response: object) => void;
  onTestError: (endpoint: MockEndpoint, error: string) => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500/20 text-blue-400',
  POST: 'bg-green-500/20 text-green-400',
  PUT: 'bg-yellow-500/20 text-yellow-400',
  DELETE: 'bg-red-500/20 text-red-400',
};

export function EndpointCard({ endpoint, onDelete, onTest, onTestError }: EndpointCardProps) {
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await testEndpoint(endpoint.path, endpoint.method);
      onTest(endpoint, response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch';
      onTestError(endpoint, errorMessage);
    } finally {
      setTesting(false);
    }
  };

  const handleCopy = async () => {
    const url = `http://localhost:3001${endpoint.path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${methodColors[endpoint.method]}`}>
              {endpoint.method}
            </span>
            <code className="text-sm text-neutral-300 truncate">{endpoint.path}</code>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            {endpoint.delay && endpoint.delay > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
                {endpoint.delay}ms
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              {new Date(endpoint.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            title="Copy URL"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleTest}
            disabled={testing}
            title="Test endpoint"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-red-400"
            onClick={() => onDelete(endpoint.id)}
            title="Delete endpoint"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
