"use client";

import React from "react";
import { PersonalQuotaInfo, WorkspaceQuotaInfo } from "@/hooks/useTask";
import { QuotaSkeleton } from "./TaskQouta/QoutaSkeleton";
import { WorkspaceCard } from "./TaskQouta/WorkspaceCard";
import { PersonalCard } from "./TaskQouta/PersonalCard";


interface QuotaDetailsProps {
  qouta?: PersonalQuotaInfo | WorkspaceQuotaInfo | null;
}


function isPersonal(q: PersonalQuotaInfo | WorkspaceQuotaInfo): q is PersonalQuotaInfo {
  return "dailyLimit" in q && "remaining" in q && !("workspaceUsedToday" in q);
}

export function formatResetTime(resetAt: string): string {
  const reset = new Date(resetAt);
  const now   = new Date();
  const ms    = reset.getTime() - now.getTime();
  if (ms <= 0) return "resetting…";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}



export function getPlanBadgeBg(plan: string): string {
  switch (plan) {
    case "ENTERPRISE": return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    case "BUSINESS":   return "bg-chart-2/10 text-chart-2 border-chart-2/20";
    case "PRO":        return "bg-primary/8 text-primary border-primary/20";
    default:           return "bg-muted text-muted-foreground border-border";
  }
}

export default function TaskQuotaDetails({ qouta }: QuotaDetailsProps) {
  if (qouta === undefined) return <QuotaSkeleton />;
  if (qouta === null)      return null;

  if (isPersonal(qouta)) return <PersonalCard q={qouta} />;
  return <WorkspaceCard q={qouta} />;
}