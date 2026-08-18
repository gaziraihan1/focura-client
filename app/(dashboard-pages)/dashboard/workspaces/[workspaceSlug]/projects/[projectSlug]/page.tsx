"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckSquare,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { useUserProfile } from "@/hooks/useUser";
import { useProjectMilestones, useProjectSprints, useProjectSections, useProjectViews } from "@/hooks/useProjectFeatures";
import { AccessDeniedProject } from "@/components/Dashboard/ProjectDetails/AccessDeniedProject";
import LoadingState from "@/components/Dashboard/ProjectDetails/LoadingState";
import { StatPill } from "@/components/Dashboard/Workspaces/project/StatPill";
import { MemberAvatars } from "@/components/Dashboard/Workspaces/project/MemberAvatars";
import { ProjectData } from "@/types/project.types";
import { ProjectHeader } from "@/components/Dashboard/Workspaces/project/ProjectHeader";
import { QuickAccessGrid } from "@/components/Dashboard/Workspaces/project/QuickAccessGrid";
import { TaskProgressCard } from "@/components/Dashboard/Workspaces/project/TaskProgressCard";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
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

// ─── Sub-sections ─────────────────────────────────────────────────────────────

interface StatsRibbonProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalMembers: number;
  completionPct: number;
  accentColor: string;
}

function StatsRibbon({
  totalTasks,
  completedTasks,
  inProgressTasks,
  totalMembers,
  completionPct,
  accentColor,
}: StatsRibbonProps) {
  return (
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
  );
}




interface AtAGlanceProps {
  project: ProjectData;
  isOverdue: boolean;
  dueLabel: string;
  totalMembers: number;
  canManage: boolean;
  onManage: () => void;
}

function AtAGlanceCards({ project, isOverdue, dueLabel, totalMembers, canManage, onManage }: AtAGlanceProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Deadline card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Flame size={15} className={isOverdue ? "text-destructive" : "text-muted-foreground"} />
          </div>
          <p className="text-sm font-semibold text-foreground">Deadline</p>
        </div>

        {project.dueDate ? (
          <div className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {formatDate(project.dueDate)}
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
          {canManage && (
            <button
              onClick={onManage}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Manage <ChevronRight size={11} />
            </button>
          )}
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
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectOverviewPage() {
  const params = useParams();
  const router = useRouter();

  const workspaceSlug = params?.workspaceSlug as string;
  const projectSlug   = params?.projectSlug   as string;

  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);
  const { data: milestoneStats } = useProjectMilestones(project?.id);
  const { data: sprintStats } = useProjectSprints(project?.id);
  const { data: sectionItems = [] } = useProjectSections(project?.id);
  const { data: viewItems = [] } = useProjectViews(project?.id);
  const { userId, isLoading: userLoading } = useUserProfile();

  // Access check
  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    return project.members.some((m) => m.userId === userId || m.user?.id === userId);
  }, [project?.members, userId]);

  // Manager-only pages (Settings, Analytics, Time Reports, Milestones, Sprints,
  // Sections, Views) are hidden from collaborators/viewers — keep the overview
  // links to them hidden too.
  const canManage = useMemo(() => {
    if (!project || !userId) return false;
    if (project.isAdmin) return true;
    return !!project.members?.some(
      (m) =>
        (m.userId === userId || m.user?.id === userId) && m.role === "MANAGER",
    );
  }, [project, userId]);

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

  const navigate = (path: string) => router.push(path);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      
<ProjectHeader project={project} accentColor={accentColor} completionPct={completionPct} isOverdue={isOverdue} dueLabel={dueLabel} totalMembers={totalMembers} />
      {/* ── Top stats ribbon ─────────────────────────────────────────────── */}
      <StatsRibbon
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        totalMembers={totalMembers}
        completionPct={completionPct}
        accentColor={accentColor}
      />

      {/* ── Task breakdown ───────────────────────────────────────────────── */}
      <TaskProgressCard
        base={base}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        accentColor={accentColor}
        onViewAll={() => navigate(`${base}/tasks`)}
      />

      {/* ── Quick access cards ────────────────────────────────────────────── */}
      <QuickAccessGrid
        base={base}
        totalTasks={totalTasks}
        totalAnnouncements={totalAnnouncements}
        totalMembers={totalMembers}
        accentColor={accentColor}
        milestoneCount={milestoneStats?.total ?? 0}
        sprintCount={sprintStats?.sprints?.length ?? 0}
        sectionCount={sectionItems.length}
        viewCount={viewItems.length}
        canManage={canManage}
        onNavigate={navigate}
      />

      {/* ── At a glance info ─────────────────────────────────────────────── */}
      <AtAGlanceCards
        project={project as ProjectData}
        isOverdue={isOverdue}
        dueLabel={dueLabel}
        totalMembers={totalMembers}
        canManage={canManage}
        onManage={() => navigate(`${base}/settings?tab=members`)}
      />

    </div>
  );
}
