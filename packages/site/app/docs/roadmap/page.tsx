"use client";

import { useTranslation } from "@/lib/i18n";
import {
  Rocket,
  Code2,
  Globe,
  CheckCircle2,
  Circle,
  Loader2
} from "lucide-react";

interface RoadmapItem {
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
}

interface RoadmapPhase {
  title: string;
  icon: React.ElementType;
  items: RoadmapItem[];
}

export default function RoadmapPage() {
  const { t } = useTranslation();

  const phases: RoadmapPhase[] = [
    {
      title: t.docs.roadmap.comingNext,
      icon: Rocket,
      items: [
        { title: t.docs.roadmap.items.openApi.title, description: t.docs.roadmap.items.openApi.description, status: "planned" },
        { title: t.docs.roadmap.items.docker.title, description: t.docs.roadmap.items.docker.description, status: "planned" },
        { title: t.docs.roadmap.items.recording.title, description: t.docs.roadmap.items.recording.description, status: "planned" },
      ],
    },
    {
      title: t.docs.roadmap.inDevelopment,
      icon: Loader2,
      items: [
        { title: t.docs.roadmap.items.websocket.title, description: t.docs.roadmap.items.websocket.description, status: "in-progress" },
        { title: t.docs.roadmap.items.graphql.title, description: t.docs.roadmap.items.graphql.description, status: "in-progress" },
        { title: t.docs.roadmap.items.scripting.title, description: t.docs.roadmap.items.scripting.description, status: "in-progress" },
      ],
    },
    {
      title: t.docs.roadmap.considerations,
      icon: Circle,
      items: [
        { title: t.docs.roadmap.items.analytics.title, description: t.docs.roadmap.items.analytics.description, status: "planned" },
        { title: t.docs.roadmap.items.environments.title, description: t.docs.roadmap.items.environments.description, status: "planned" },
        { title: t.docs.roadmap.items.vscode.title, description: t.docs.roadmap.items.vscode.description, status: "planned" },
        { title: t.docs.roadmap.items.team.title, description: t.docs.roadmap.items.team.description, status: "planned" },
        { title: t.docs.roadmap.items.plugins.title, description: t.docs.roadmap.items.plugins.description, status: "planned" },
        { title: t.docs.roadmap.items.grpc.title, description: t.docs.roadmap.items.grpc.description, status: "planned" },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Circle className="h-5 w-5 text-neutral-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500/30 bg-green-500/5";
      case "in-progress":
        return "border-blue-500/30 bg-blue-500/5";
      default:
        return "border-neutral-800 dark:border-neutral-700";
    }
  };

  return (
    <>
      <h1>{t.docs.roadmap.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.roadmap.description}
      </p>

      <div className="mt-8 space-y-12">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-600/10">
                <phase.icon className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">{phase.title}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {phase.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`p-5 rounded-lg border ${getStatusStyles(item.status)} transition-all hover:border-green-600/30`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white text-neutral-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg border border-green-600/20 bg-green-600/5">
        <h3 className="font-semibold mb-2 dark:text-white text-neutral-900">
          {t.docs.roadmap.contributeTitle}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t.docs.roadmap.contributeDescription}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/Miguel-Leite/mockario/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-600/90 transition-colors"
          >
            <Code2 className="h-4 w-4 text-white" />
            <span className="text-white">{t.docs.roadmap.issues}</span>
          </a>
          <a
            href="https://github.com/Miguel-Leite/mockario/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-neutral-800 dark:text-white text-neutral-800 dark:bg-neutral-900 bg-white hover:bg-neutral-100 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {t.docs.roadmap.discussions}
          </a>
        </div>
      </div>
    </>
  );
}
