"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

const codeExample = [
  { type: "punct", content: "{" },
  { type: "key", content: "\n  \"users\"" },
  { type: "punct", content: ": [" },
  { type: "punct", content: "{" },
  { type: "key", content: "\n    \"id\"" },
  { type: "punct", content: ": " },
  { type: "string", content: "\"uuid-001\"" },
  { type: "punct", content: "," },
  { type: "key", content: "\n    \"name\"" },
  { type: "punct", content: ": " },
  { type: "string", content: "\"John Doe\"" },
  { type: "punct", content: "," },
  { type: "key", content: "\n    \"email\"" },
  { type: "punct", content: ": " },
  { type: "string", content: "\"john@example.com\"" },
  { type: "punct", content: "\n  }," },
  { type: "punct", content: "{" },
  { type: "key", content: "\n    \"id\"" },
  { type: "punct", content: ": " },
  { type: "string", content: "\"uuid-002\"" },
  { type: "punct", content: "," },
  { type: "key", content: "\n    \"name\"" },
  { type: "punct", content: ": " },
  { type: "string", content: "\"Jane Smith\"" },
  { type: "punct", content: "\n  }" },
  { type: "punct", content: "]," },
  { type: "key", content: "\n  \"meta\"" },
  { type: "punct", content: ": {" },
  { type: "key", content: "\n    \"total\"" },
  { type: "punct", content: ": " },
  { type: "number", content: "2" },
  { type: "punct", content: "," },
  { type: "key", content: "\n    \"page\"" },
  { type: "punct", content: ": " },
  { type: "number", content: "1" },
  { type: "punct", content: "\n  }" },
  { type: "punct", content: "\n}" },
];

const colorMap: Record<string, string> = {
  punct: "text-neutral-400",
  key: "text-green-400",
  string: "text-orange-300",
  number: "text-blue-400",
};

export function CodeExample() {
  const [copied, setCopied] = useState(false);

  const codeString = `{
  "users": [
    {
      "id": "uuid-001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": "uuid-002",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1
  }
}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden dark:bg-neutral-950 bg-neutral-100 py-20">
      <div className="absolute inset-0 bg-grid-dots opacity-30" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl dark:text-white text-neutral-900">
              Dados mock realistas
            </h2>
            <p className="mt-4 dark:text-neutral-400 text-neutral-600">
              Gere dados falsos automaticamente com Faker
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900 bg-white">
            <div className="flex items-center justify-between border-b dark:border-neutral-800 border-neutral-200 px-3 md:px-4 py-2 md:py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-red-500" />
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-yellow-500" />
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-green-500" />
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs md:text-sm dark:text-neutral-400 text-neutral-600 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto p-3 md:p-4">
              <pre className="font-mono text-xs md:text-sm leading-relaxed">
                <code>
                  {codeExample.map((token, i) => (
                    <span key={i} className={colorMap[token.type]}>
                      {token.content}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
