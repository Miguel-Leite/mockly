"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, LayoutDashboard, Rocket, Check, Copy } from "lucide-react";
import { Terminal as AnimatedTerminal, AnimatedSpan, TypingAnimation, Safari } from "./ui";
import { useTranslation } from "@/lib/i18n";

const codeExampleHooks = [
  { type: "keyword", content: "import" },
  { type: "punct", content: " " },
  { type: "punct", content: "{" },
  { type: "function", content: " MockarioProvider" },
  { type: "punct", content: "," },
  { type: "function", content: " useMockEndpoints" },
  { type: "punct", content: "} " },
  { type: "keyword", content: "from" },
  { type: "string", content: " 'mockario'" },
  { type: "punct", content: ";" },
  { type: "punct", content: "\n\n" },
  { type: "keyword", content: "function" },
  { type: "function", content: " UsersList" },
  { type: "punct", content: "()" },
  { type: "punct", content: " {" },
  { type: "punct", content: "\n  " },
  { type: "keyword", content: "const" },
  { type: "punct", content: " " },
  { type: "variable", content: "{" },
  { type: "variable", content: " endpoints" },
  { type: "punct", content: "," },
  { type: "variable", content: " isLoading" },
  { type: "punct", content: "} " },
  { type: "keyword", content: "=" },
  { type: "function", content: " useMockEndpoints" },
  { type: "punct", content: "(" },
  { type: "string", content: "'http://localhost:3001'" },
  { type: "punct", content: ")" },
  { type: "punct", content: ";" },
  { type: "punct", content: "\n\n  " },
  { type: "keyword", content: "if" },
  { type: "punct", content: "(" },
  { type: "variable", content: "isLoading" },
  { type: "punct", content: ")" },
  { type: "keyword", content: " return" },
  { type: " punct", content: " " },
  { type: "punct", content: "<" },
  { type: "function", content: "div" },
  { type: "punct", content: ">Loading...</" },
  { type: "function", content: "div" },
  { type: "punct", content: ">;" },
  { type: "punct", content: "\n\n  " },
  { type: "keyword", content: "return" },
  { type: "punct", content: " " },
  { type: "punct", content: "(" },
  { type: "punct", content: "\n    " },
  { type: "punct", content: "<" },
  { type: "function", content: "ul" },
  { type: "punct", content: ">" },
  { type: "punct", content: "\n      " },
  { type: "punct", content: "{" },
  { type: "variable", content: "endpoints" },
  { type: "punct", content: "." },
  { type: "function", content: "map" },
  { type: "punct", content: "(" },
  { type: "keyword", content: "endpoint" },
  { type: "punct", content: " " },
  { type: "keyword", content: "=>" },
  { type: " punct", content: " " },
  { type: "punct", content: "(" },
  { type: "punct", content: "\n        " },
  { type: "punct", content: "<" },
  { type: "function", content: "li" },
  { type: "keyword", content: " key" },
  { type: "punct", content: "={" },
  { type: "variable", content: "endpoint" },
  { type: "punct", content: "." },
  { type: "variable", content: "id" },
  { type: "punct", content: "}>" },
  { type: "punct", content: "{" },
  { type: "variable", content: "endpoint" },
  { type: "punct", content: "." },
  { type: "variable", content: "path" },
  { type: "punct", content: "}</" },
  { type: "function", content: "li" },
  { type: "punct", content: ">" },
  { type: "punct", content: "\n      " },
  { type: "punct", content: ")" },
  { type: "punct", content: ")" },
  { type: "punct", content: "\n    " },
  { type: "punct", content: "</" },
  { type: "function", content: "ul" },
  { type: "punct", content: ">;" },
  { type: "punct", content: "\n  " },
  { type: "punct", content: ")" },
  { type: "punct", content: ";" },
  { type: "punct", content: "\n" },
  { type: "punct", content: "}" },
];

const colorMapHooks: Record<string, string> = {
  keyword: "text-purple-400",
  function: "text-blue-400",
  variable: "text-green-400",
  string: "text-orange-300",
  punct: "text-neutral-400",
  number: "text-blue-400",
};

const codeStringHooks = `import { MockarioProvider, useMockEndpoints } from '@mockario/mockario';

function UsersList() {
  const { endpoints, isLoading } = useMockEndpoints('http://localhost:3001');

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {endpoints.map(endpoint => (
        <li key={endpoint.id}>{endpoint.path}</li>
      ))}
    </ul>
  );
};`;

function CodePreview() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeStringHooks);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-950 bg-neutral-50">
      <div className="flex items-center justify-between border-b dark:border-neutral-800 border-neutral-200 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 text-xs dark:text-neutral-400 text-neutral-600 hover:text-green-500 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              {t.common.copied}
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              {t.common.copy}
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3">
        <pre className="font-mono text-[10px] leading-relaxed">
          <code>
            {codeExampleHooks.map((token, i) => (
              <span key={i} className={colorMapHooks[token.type]}>
                {token.content}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Terminal,
      title: t.home.steps.startServer,
      description: t.home.steps.startServerDesc,
      code: "npx @mockario/mockario start",
      component: (
        <>
          <AnimatedTerminal className="w-full h-48 md:h-56 lg:h-72 -mx-2 md:mx-0">
            <TypingAnimation>npx @mockario/mockario start</TypingAnimation>
            <AnimatedSpan>🚀 Starting Mockario...</AnimatedSpan>
            <AnimatedSpan>📦 Starting mock server on port 3001...</AnimatedSpan>
            <AnimatedSpan>🌐 Starting Mockario Web Interface...</AnimatedSpan>
            <AnimatedSpan>✔ Mockario is running!</AnimatedSpan>
          </AnimatedTerminal>
        </>
      )
    },
    {
      icon: LayoutDashboard,
      title: t.home.steps.configure,
      description: t.home.steps.configureDesc,
      code: "http://localhost:3001",
      component: (
        <div className="w-full">
          <Safari
            className="pb-0 mb-0"
            url="http://localhost:3001"
            imageSrc="/create-endpoint.png"
          />
        </div>
      ),
    },
    {
      icon: Rocket,
      title: t.home.steps.develop,
      description: t.home.steps.developDesc,
      code: "GET /api/users",
      component: <CodePreview />
    },
  ];

  return (
    <section className="relative overflow-hidden dark:bg-neutral-950 bg-neutral-100 py-12 md:py-20">
      <div className="absolute inset-0 bg-grid-dots opacity-30" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white text-neutral-900">
            {t.home.howItWorks}
          </h2>
          <p className="mt-3 md:mt-4 dark:text-neutral-400 text-neutral-600 text-sm md:text-base">
            {t.home.howItWorksSubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="rounded-lg border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900 bg-white p-4 md:p-6 overflow-hidden"
            >
              <div className="mb-3 md:mb-4 flex items-center justify-between">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-green-600/10">
                  <step.icon className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <span className="text-xl md:text-2xl font-bold dark:text-neutral-700 text-neutral-400">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-2 text-base md:text-lg font-semibold dark:text-white text-neutral-900">{step.title}</h3>
              <p className="mb-3 md:mb-4 text-sm dark:text-neutral-400 text-neutral-600">{step.description}</p>
              {step.component}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
