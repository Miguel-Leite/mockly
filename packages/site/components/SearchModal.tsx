"use client";

import { useEffect, useState, useRef } from "react";
import { Search, FileText, Command, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSearch = () => {
    if (query.trim()) {
      setOpen(false);
      setQuery("");
      if (query.startsWith("doc:")) {
        const doc = query.replace("doc:", "");
        router.push(`/docs?slug=${doc}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary rounded-md hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm isolate" 
        onClick={() => {
          setOpen(false);
          setQuery("");
        }} 
      />
      <div className="relative w-full max-w-lg mx-4 bg-popover border border-border rounded-lg shadow-lg">
        <div className="flex items-center gap-2 border-b border-border px-3 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar documentação..."
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-600/90 transition-colors"
          >
            Buscar
          </button>
          <kbd 
            className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          >
            ESC
          </kbd>
        </div>
        <div className="py-4">
          <p className="px-3 py-4 text-center text-sm text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            {query ? `Resultados para "${query}"` : "Digite para buscar na documentação"}
          </p>
        </div>
      </div>
    </div>
  );
}
