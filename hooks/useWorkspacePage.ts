"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/hooks/useWorkspace";


interface PlanBadge {
  color: string;
  label: string;
}

const PLAN_BADGES: Record<string, PlanBadge> = {
  FREE: { color: "bg-gray-500/10 text-gray-500", label: "Free" },
  PRO: { color: "bg-blue-500/10 text-blue-500", label: "Pro" },
  BUSINESS: { color: "bg-purple-500/10 text-purple-500", label: "Business" },
  ENTERPRISE: { color: "bg-orange-500/10 text-orange-500", label: "Enterprise" },
};

export function useWorkspacesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: workspaces = [],
    isLoading,
    isError,
  } = useWorkspaces();

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workspaces, searchQuery]);

  const getPlanBadge = (plan: string): PlanBadge =>
    PLAN_BADGES[plan] ?? PLAN_BADGES.FREE;

  const navigateToCreate = () =>
    router.push("/dashboard/workspaces/new-workspace");

  const navigateToSettings = (slug: string) =>
    router.push(`/dashboard/workspaces/${slug}/settings`);

  return {
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    filteredWorkspaces,
    getPlanBadge,
    navigateToCreate,
    navigateToSettings,
  };
}
