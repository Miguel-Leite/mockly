import Link from "next/link";
import { ArrowRight, BookOpen, Terminal, Zap, Database, Shield, Send } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Aprenda os conceitos básicos do Mockario",
    href: "/docs/getting-started",
  },
  {
    icon: Terminal,
    title: "Installation",
    description: "Como instalar e configurar",
    href: "/docs/installation",
  },
  {
    icon: Zap,
    title: "Quick Start",
    description: "Guia rápido para começar",
    href: "/docs/quick-start",
  },
  {
    icon: Database,
    title: "Features",
    description: "Endpoints, Schemas, Authentication",
    href: "/docs/features/endpoints",
  },
  {
    icon: Send,
    title: "HTTP Client",
    description: "Teste seus endpoints",
    href: "/docs/http-client",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Documentação</h1>
        <p className="text-lg text-muted-foreground">
          Tudo que você precisa saber para usar o Mockario
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start gap-4 rounded-lg border border-border p-4 hover:border-green-600/50 hover:bg-secondary/50 transition-colors"
          >
            <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
              <section.icon className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold group-hover:text-green-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
