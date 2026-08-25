import { CheckSquare, Megaphone, Users, Flag, Sprout, Columns, Eye } from "lucide-react";
import { QuickAccessCard } from "./QuickAccessCard";

interface QuickAccessGridProps {
  base: string;
  totalTasks: number;
  totalAnnouncements: number;
  totalMembers: number;
  accentColor: string;
  milestoneCount: number;
  sprintCount: number;
  sectionCount: number;
  viewCount: number;
  canManage: boolean;
  onNavigate: (path: string) => void;
}

export function QuickAccessGrid({
  base,
  totalTasks,
  totalAnnouncements,
  totalMembers,
  accentColor,
  milestoneCount,
  sprintCount,
  sectionCount,
  viewCount,
  canManage,
  onNavigate,
}: QuickAccessGridProps) {
  return (
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
          onClick={() => onNavigate(`${base}/tasks`)}
        />

        <QuickAccessCard
          icon={Megaphone}
          title="Announcements"
          description="Post updates, pin important notices and keep your team informed in one place."
          stat={totalAnnouncements}
          statLabel="posts"
          accent="#f59e0b"
          onClick={() => onNavigate(`${base}/announcements`)}
        />

        <QuickAccessCard
          icon={Users}
          title="Members"
          description="View collaborators, manage roles and invite new people to the project."
          stat={totalMembers}
          statLabel="members"
          accent="#8b5cf6"
          onClick={() => onNavigate(`${base}/members`)}
        />

        {canManage && (
          <QuickAccessCard
            icon={Flag}
            title="Milestones"
            description="Track key milestones with health status (on track / at risk / delayed) and progress."
            stat={milestoneCount}
            statLabel="milestones"
            accent="#f59e0b"
            onClick={() => onNavigate(`${base}/milestones`)}
          />
        )}

        {canManage && (
          <QuickAccessCard
            icon={Sprout}
            title="Sprints"
            description="Plan time-boxed iterations, track velocity and run retrospectives."
            stat={sprintCount}
            statLabel="sprints"
            accent="#10b981"
            onClick={() => onNavigate(`${base}/sprints`)}
          />
        )}

        {canManage && (
          <QuickAccessCard
            icon={Columns}
            title="Sections"
            description="Organize tasks into sections — map any section to a board column with WIP limits."
            stat={sectionCount}
            statLabel="sections"
            accent="#8b5cf6"
            onClick={() => onNavigate(`${base}/sections`)}
          />
        )}

        {canManage && (
          <QuickAccessCard
            icon={Eye}
            title="Views"
            description="Save custom views (Kanban, List, Calendar, Timeline) to switch perspectives instantly."
            stat={viewCount}
            statLabel="views"
            accent="#14b8a6"
            onClick={() => onNavigate(`${base}/views`)}
          />
        )}
      </div>
    </div>
  );
}
