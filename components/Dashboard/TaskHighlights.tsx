'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useWorkspaces } from '@/hooks/useWorkspace';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  CalendarDays,
  Flame,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  workspaceName?: string;
  workspaceSlug?: string;
}

const PRIORITY_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  URGENT: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', label: 'Urgent' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', label: 'High' },
  MEDIUM: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', label: 'Medium' },
  LOW: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', label: 'Low' },
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  IN_PROGRESS: Clock,
  TODO: Clock,
  COMPLETED: CheckCircle2,
  OVERDUE: AlertCircle,
};

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((target.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function TaskHighlights() {
  const { data: workspaces = [], isLoading: wsLoading } = useWorkspaces();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['dashboard-task-highlights', workspaces.map((w) => w.id)],
    queryFn: async () => {
      const results = await Promise.all(
        workspaces.map((ws) =>
          api
            .get<Task[]>(`/api/v1/workspaces/${ws.slug}/tasks?limit=20`)
            .then((res) =>
              (res?.data ?? []).map((t) => ({
                ...t,
                workspaceName: ws.name,
                workspaceSlug: ws.slug,
              }))
            )
            .catch(() => [] as Task[])
        )
      );

      const allTasks = results.flat();

      // Prioritize: overdue first, then due soon, then in progress
      return allTasks
        .sort((a, b) => {
          // Overdue tasks first
          if (a.dueDate && isOverdue(a.dueDate) && !(b.dueDate && isOverdue(b.dueDate))) return -1;
          if (!(a.dueDate && isOverdue(a.dueDate)) && b.dueDate && isOverdue(b.dueDate)) return 1;

          // Then by due date
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;

          // Finally by priority
          const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4) -
                 (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4);
        })
        .slice(0, 6);
    },
    enabled: !wsLoading && workspaces.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const loading = wsLoading || tasksLoading;

  if (!loading && tasks.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Tasks needing attention</h2>
        </div>
        <div className="text-center py-6">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">All caught up! No urgent tasks.</p>
          <Link
            href="/dashboard/tasks/add-task"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-primary hover:underline"
          >
            Create a new task <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Tasks needing attention</h2>
        </div>
        <Link
          href="/dashboard/tasks"
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 items-start animate-pulse">
              <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2.5 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => {
            const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.MEDIUM;
            const overdue = task.dueDate && isOverdue(task.dueDate);
            const StatusIcon = STATUS_ICONS[task.status] ?? Clock;

            return (
              <Link
                key={task.id}
                href={task.workspaceSlug ? `/dashboard/workspaces/${task.workspaceSlug}` : '#'}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition group"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    overdue ? 'bg-red-500/10' : priority.bg
                  }`}
                >
                  <StatusIcon
                    size={12}
                    className={overdue ? 'text-red-600 dark:text-red-400' : priority.text}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.workspaceName && (
                      <span className="text-xs text-muted-foreground">{task.workspaceName}</span>
                    )}
                    {task.dueDate && (
                      <span
                        className={`text-xs ${
                          overdue
                            ? 'text-red-600 dark:text-red-400 font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatDueDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}
                >
                  {priority.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
