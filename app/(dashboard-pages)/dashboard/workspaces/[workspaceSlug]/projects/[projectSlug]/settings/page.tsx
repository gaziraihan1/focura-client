"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Settings,
  Users,
  Palette,
  Lock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useWorkspaceRole } from "@/hooks/useWorkspace";
import { useUserProfile } from "@/hooks/useUser";
import {
  GeneralTab,
  AppearanceTab,
  DangerTab,
  MembersTab,
} from "@/components/Dashboard/Workspaces/project/Settings";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";

type SettingsTab = "general" | "members" | "appearance" | "danger";

interface TabDef {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
}

const TABS: TabDef[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "members", label: "Members", icon: Users },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectSettingsPage() {
  const params = useParams();
  const workspaceSlug = params?.workspaceSlug as string;
  const projectSlug = params?.projectSlug as string;

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const {
    data: project,
    isLoading,
    isRefetching,
  } = useProjectDetailsBySlug(projectSlug);
  const workspaceId = project?.workspaceId ?? "";

  const workspaceRole = useWorkspaceRole(workspaceId);
  const { userId, isLoading: userLoading } = useUserProfile();

  const isOwnerOrAdmin = workspaceRole.isOwner || workspaceRole.isAdmin;

  const currentProjectMember = useMemo(
    () =>
      project?.members?.find(
        (m) => m.userId === userId || m.user?.id === userId,
      ),
    [project?.members, userId],
  );

  const isManager = currentProjectMember?.role === "MANAGER";
  const canManage = isOwnerOrAdmin || isManager;

  // Wait for ALL async sources before allowing the access denied check.
  // canManage is false while any of these are still loading → flash of denied without this guard.
  const isResolved =
    !isLoading &&
    !userLoading &&
    !workspaceRole.isLoading &&
    !!project &&
    !!userId;

  // During a background refetch (e.g. after saving name/color), isLoading stays false
  // but the query re-runs. We already have valid project + userId so treat it as stable —
  // prevents canManage from evaluating against stale/empty data and flashing access denied.
  const isStable = isResolved || (isRefetching && !!project && !!userId);

  const accentColor = project?.color ?? "#667eea";

  if (!isStable) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Lock size={24} className="text-muted-foreground/50" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Access Restricted
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Only project managers and workspace admins can access settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        {/* Project color pill */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm mt-0.5"
          style={{ backgroundColor: accentColor }}
        >
          {project?.name?.charAt(0).toUpperCase() ?? "P"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Settings size={13} className="text-muted-foreground" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Settings
            </span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight">
            {project?.name ?? "Project"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage project settings, members and preferences.
          </p>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      {/* Desktop: horizontal tab bar / Mobile: scrollable pill row */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0",
                active
                  ? tab.danger
                    ? "bg-destructive text-white shadow-sm"
                    : "bg-primary text-primary-foreground shadow-sm"
                  : tab.danger
                    ? "text-destructive/70 hover:text-destructive hover:bg-destructive/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
              ].join(" ")}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
              {/* mobile: just icon */}
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <div>
        {activeTab === "general" && (
          <GeneralTab project={project} canManage={canManage} />
        )}

        {activeTab === "members" && (
          <MembersTab project={project} canManage={canManage} userId={userId} />
        )}

        {activeTab === "appearance" && (
          <AppearanceTab project={project} canManage={canManage} />
        )}

        {activeTab === "danger" && (
          <DangerTab
            project={project}
            canManage={canManage}
            isOwnerOrAdmin={isOwnerOrAdmin}
            workspaceSlug={workspaceSlug}
          />
        )}
      </div>
    </div>
  );
}
