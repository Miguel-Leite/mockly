import { Link, useLocation } from 'react-router-dom';
import { FileText, Database, Settings, Send } from 'lucide-react';

interface HeaderProps {
  serverConnected?: boolean;
}

export function Header({ serverConnected = true }: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Mockario" className="w-16" />
            </Link>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive('/') && !isActive('/schemas') && !isActive('/settings')
                ? 'bg-neutral-800 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              <FileText className="h-4 w-4" />
              Endpoints
            </Link>
            <Link
              to="/schemas"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive('/schemas')
                ? 'bg-neutral-800 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              <Database className="h-4 w-4" />
              Schemas
            </Link>
            <Link
              to="/http-client"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive('/http-client')
                ? 'bg-neutral-800 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              <Send className="h-4 w-4" />
              HTTP
            </Link>
            <Link
              to="/settings"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive('/settings')
                ? 'bg-neutral-800 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500">Server: localhost:3001</span>
          <div
            className={`h-2 w-2 rounded-full animate-pulse ${serverConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
          />
        </div>
      </div>
    </header>
  );
}
