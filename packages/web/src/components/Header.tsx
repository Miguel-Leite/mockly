import { Server } from 'lucide-react';

interface HeaderProps {
  serverConnected?: boolean;
}

export function Header({ serverConnected = true }: HeaderProps) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-600/20 rounded-lg">
            <Server className="h-5 w-5 text-primary-600" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-100">Mockly</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500">Server: localhost:3001</span>
          <div 
            className={`h-2 w-2 rounded-full animate-pulse ${
              serverConnected ? 'bg-green-500' : 'bg-red-500'
            }`} 
          />
        </div>
      </div>
    </header>
  );
}
