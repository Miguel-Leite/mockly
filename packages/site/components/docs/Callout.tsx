"use client";

import { AlertCircle, Info, Lightbulb, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

type CalloutType = "note" | "warning" | "tip" | "info";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const styles = {
  note: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Info,
    iconColor: "text-blue-500",
    titleColor: "text-blue-400",
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-400",
  },
  tip: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: Lightbulb,
    iconColor: "text-green-500",
    titleColor: "text-green-400",
  },
  info: {
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/30",
    icon: AlertCircle,
    iconColor: "text-neutral-400",
    titleColor: "text-neutral-300",
  },
};

const defaultTitles = {
  note: "Note",
  warning: "Warning",
  tip: "Tip",
  info: "Info",
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const style = styles[type];
  const Icon = style.icon;
  const displayTitle = title || defaultTitles[type];

  return (
    <div
      className={`my-4 rounded-lg border ${style.border} ${style.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${style.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${style.titleColor} mb-1`}>{displayTitle}</p>
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
