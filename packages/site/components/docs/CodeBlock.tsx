"use client";

import { useState, useRef } from "react";
import { Check, Copy, ChevronDown } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languageLabels: Record<string, string> = {
    bash: "Terminal",
    javascript: "JavaScript",
    typescript: "TypeScript",
    json: "JSON",
    python: "Python",
    html: "HTML",
    css: "CSS",
    jsx: "JSX",
    tsx: "TSX",
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden my-4">
      <div className="flex items-center justify-between bg-neutral-900 px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          {filename && (
            <span className="ml-2 text-xs text-neutral-400">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">
            {languageLabels[language] || language}
          </span>
          <button
            onClick={copyCode}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-neutral-400" />
            )}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-neutral-950 p-4">
        <pre className="font-mono text-sm leading-relaxed">
          <code className="text-neutral-100">{code}</code>
        </pre>
      </div>
    </div>
  );
}
