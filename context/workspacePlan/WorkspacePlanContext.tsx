"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { Workspace } from "@/hooks/useWorkspace";

export type PlanName = Workspace["plan"]; // 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'

interface WorkspacePlanContextValue {
  planName:     PlanName | null;
  isLoading:    boolean;
  isFree:       boolean;
  isPro:        boolean;
  isBusiness:   boolean;
  isEnterprise: boolean;
  isPaid:       boolean;
  hasPlan:      (p: PlanName) => boolean;
}

const WorkspacePlanContext = createContext<WorkspacePlanContextValue | null>(null);

export function WorkspacePlanProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const { data: workspace, isLoading } = useWorkspace(slug);

  const value = useMemo<WorkspacePlanContextValue>(() => {
    const plan = workspace?.plan ?? null;

    return {
      planName:     plan,
      isLoading,
      isFree:       plan === "FREE",
      isPro:        plan === "PRO",
      isBusiness:   plan === "BUSINESS",
      isEnterprise: plan === "ENTERPRISE",
      isPaid:       plan !== "FREE" && plan !== null,
      hasPlan:      (p) => plan === p,
    };
  }, [workspace?.plan, isLoading]);

  return (
    <WorkspacePlanContext.Provider value={value}>
      {children}
    </WorkspacePlanContext.Provider>
  );
}

export function useWorkspacePlan(): WorkspacePlanContextValue {
  const ctx = useContext(WorkspacePlanContext);
  if (!ctx) throw new Error("useWorkspacePlan must be used inside WorkspacePlanProvider");
  return ctx;
}