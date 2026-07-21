"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckSquare,
  Megaphone,
  Users,
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { useUserProfile } from "@/hooks/useUser";
import { AccessDeniedProject } from "@/components/Dashboard/ProjectDetails/AccessDeniedProject";
import LoadingState from "@/components/Dashboard/ProjectDetails/LoadingState";
import { StatPill } from "@/components/Dashboard/Workspaces/project/StatPill";
import { MemberAvatars } from "@/components/Dashboard/Workspaces/project/MemberAvatars";
import { StatusBar } from "@/components/Dashboard/Workspaces/project/StatusBar";
import { QuickAccessCard } from "@/components/Dashboard/Workspaces/project/QuickAccessCard";
import { ProjectData } from "@/types/project.types";
import { ProjectHeader } from "@/components/Dashboard/Workspaces/project/ProjectHeader";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ProjectOverviewPage() {
  const params = useParams();
  const router = useRouter();

  const workspaceSlug = params?.workspaceSlug as string;
  const projectSlug   = params?.projectSlug   as string;

  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);
  const { userId, isLoading: userLoading } = useUserProfile();

  // Access check
  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    return project.members.some((m) => m.userId === userId || m.user?.id === userId);
  }, [project?.members, userId]);

  if (isLoading || userLoading) return <LoadingState />;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-1">Project not found</h2>
          <p className="text-sm text-muted-foreground">
            {error ? "Failed to load project details." : "This project does not exist or you don't have access."}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!isMember && !project.isAdmin ) {
    return (
      <AccessDeniedProject
        projectName={project.name}
        workspaceName={project.workspace?.name}
      />
    );
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats         = project.stats ?? {};
  const totalTasks    = stats.totalTasks        ?? 0;
  const completedTasks = stats.completedTasks   ?? 0;
  const inProgressTasks = stats.inProgressTasks ?? 0;
  const totalMembers  = project.members?.length ?? 0;
  const totalAnnouncements = stats.totalAnnouncement ?? 0;

  const completionPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const accentColor = (project as ProjectData).color ?? "#667eea";

  const dueIn      = daysUntil((project as ProjectData).dueDate);
  const dueLabel   =
    dueIn === null
      ? "No deadline"
      : dueIn < 0
      ? `${Math.abs(dueIn)}d overdue`
      : dueIn === 0
      ? "Due today"
      : `${dueIn}d left`;

  const isOverdue = dueIn !== null && dueIn < 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      
<ProjectHeader project={project} accentColor={accentColor} completionPct={completionPct} isOverdue={isOverdue} dueLabel={dueLabel} totalMembers={totalMembers} />
      {/* ── Top stats ribbon ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <StatPill
          icon={CheckSquare}
          label="Total Tasks"
          value={totalTasks}
          sub={`${completedTasks} completed`}
          accent={accentColor}
        />
        <StatPill
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks}
          sub={`${completionPct}% rate`}
          accent="#10b981"
        />
        <StatPill
          icon={Loader2}
          label="In Progress"
          value={inProgressTasks}
          sub="active tasks"
          accent="#f59e0b"
        />
        <StatPill
          icon={Users}
          label="Members"
          value={totalMembers}
          sub="collaborators"
          accent="#8b5cf6"
        />
      </div>

      {/* ── Task breakdown ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-foreground">Task Progress</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalTasks === 0
                ? "No tasks created yet"
                : `${totalTasks - completedTasks - inProgressTasks} remaining to start`}
            </p>
          </div>
          <button
            onClick={() => router.push(`${base}/tasks`)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            View all
            <ChevronRight size={12} />
          </button>
        </div>

        {totalTasks === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Circle size={18} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No tasks yet — create your first task to get started.</p>
            <button
              onClick={() => router.push(`${base}/tasks`)}
              className="mt-1 text-xs font-semibold px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Go to Tasks
            </button>
          </div>
        ) : (
          <StatusBar
            completed={completedTasks}
            inProgress={inProgressTasks}
            total={totalTasks}
            accentColor={accentColor}
          />
        )}
      </div>

      {/* ── Quick access cards ────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAccessCard
            icon={CheckSquare}
            title="Tasks"
            description="Manage, assign and track every task in this project. Filter by status, priority or assignee."
            stat={totalTasks}
            statLabel="tasks"
            accent={accentColor}
            onClick={() => router.push(`${base}/tasks`)}
          />

          <QuickAccessCard
            icon={Megaphone}
            title="Announcements"
            description="Post updates, pin important notices and keep your team informed in one place."
            stat={totalAnnouncements}
            statLabel="posts"
            accent="#f59e0b"
            onClick={() => router.push(`${base}/announcements`)}
          />

          <QuickAccessCard
            icon={Users}
            title="Members"
            description="View collaborators, manage roles and invite new people to the project."
            stat={totalMembers}
            statLabel="members"
            accent="#8b5cf6"
            onClick={() => router.push(`${base}/members`)}
          />
        </div>
      </div>

      {/* ── At a glance info ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Deadline card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Flame size={15} className={isOverdue ? "text-destructive" : "text-muted-foreground"} />
            </div>
            <p className="text-sm font-semibold text-foreground">Deadline</p>
          </div>

          {(project as ProjectData).dueDate ? (
            <div className="space-y-1">
              <p className="text-2xl font-black text-foreground">
                {formatDate((project as ProjectData).dueDate)}
              </p>
              <p
                className={[
                  "text-sm font-semibold",
                  isOverdue ? "text-destructive" : "text-muted-foreground",
                ].join(" ")}
              >
                {dueLabel}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No deadline set.</p>
          )}
        </div>

        {/* Team card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Users size={15} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">Team</p>
            </div>
            <button
              onClick={() => router.push(`${base}/settings`)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Manage <ChevronRight size={11} />
            </button>
          </div>

          {totalMembers > 0 ? (
            <div className="flex items-center gap-3">
              <MemberAvatars members={project.members ?? []} max={7} />
              <span className="text-sm text-muted-foreground">
                {totalMembers} member{totalMembers !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No members yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}