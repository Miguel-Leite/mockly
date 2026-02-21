'use client'
import Link from "next/link";
import { Database, Shield, Send, Zap, Wand2, Code2, ArrowRight, Github } from "lucide-react";
import { MagicCard } from "@/components/ui";
import colors from "tailwindcss/colors";
import { useTheme } from "next-themes";
import { Testimonials } from "@/components/Testimonials";
import { CodeExample } from "@/components/CodeExample";
import { HowItWorks } from "@/components/HowItWorks";

const features = [
  {
    icon: Database,
    title: "Schemas & Relationships",
    description:
      "Criação de schemas e relacionamentos visuais, geração automática de dados mock",
  },
  {
    icon: Shield,
    title: "Authentication",
    description: "Suporte a JWT, API Key, Basic & Bearer",
  },
  {
    icon: Send,
    title: "Built-in HTTP Client",
    description: "Testar endpoints sem sair da interface",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Iniciar servidor + web UI com um comando",
  },
  {
    icon: Wand2,
    title: "Fake Data Generator",
    description: "Geração de dados realistas com Faker",
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    description: "CLI, Web UI e React Hooks",
  },
];



export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <div className="min-h-screen relative overflow-hidden space-y-28 pb-10">
        <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] dark:bg-[size:4rem_4rem] dark:[mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-200/50 via-transparent to-transparent" />

        {/* <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px]" /> */}
        <div className="relative w-full z-10">
          <div className="max-w-3xl w-full mx-auto mt-20 md:mt-32 lg:mt-40 px-4">
            <div className="flex flex-col items-center justify-center text-center gap-6 md:gap-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white text-neutral-900">
                  Mock APIs{" "}
                  <span className="text-green-600">rapidinho </span>
                  desenvolva sem esperar o backend
                </h1>
                <p className="text-base md:text-lg dark:text-white text-neutral-700 px-2 md:px-0">
                  Crie APIs simuladas localmente e acelere seu desenvolvimento front-end.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-600/90 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com/Miguel-Leite/mockario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border dark:border-neutral-800 border-neutral-300 dark:text-white text-neutral-800 dark:bg-neutral-900 bg-neutral-100 px-6 py-2 font-medium hover:bg-neutral-200 transition-colors"
                >
                  GitHub
                  <Github className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <CodeExample />
        <div className="max-w-6xl w-full mx-auto px-4 text-center space-y-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl dark:text-white text-neutral-900">
              Tudo que você precisa
            </h2>
            <p className="mt-4 dark:text-neutral-400 text-neutral-600">
              Ferramentas poderosas para criar e gerenciar suas APIs mock
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <MagicCard key={index} className="p-5 rounded-lg border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900 bg-white" gradientFrom={theme === "dark" ? colors.neutral[900] : colors.neutral[100]} gradientTo={theme === "dark" ? colors.green[900] : colors.green[100]}>
                <div className="flex flex-row items-start gap-2">
                  <div className="w-12 h-12 flex items-center justify-center p-1.5 rounded bg-green-600/10">
                    <feature.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1.5 text-left flex-1">
                    <h3 className="mb-2 text-lg font-semibold dark:text-white text-neutral-900">{feature.title}</h3>
                    <p className="text-sm dark:text-neutral-400 text-neutral-600">{feature.description}</p>
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>
        </div>
      </div>

      <HowItWorks />
      <Testimonials />
    </>
  );
}
