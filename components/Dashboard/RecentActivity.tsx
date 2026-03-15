"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useWorkspaces } from "@/hooks/useWorkspace";
import { CheckCircle, UserPlus, FolderPlus, Calendar, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  workspaceName?: string;
  createdAt: string;
}

const ICON_MAP: Record<string, { icon: typeof CheckCircle; bg: string; color: string }> = {
  TASK_COMPLETED:    { icon: CheckCircle, bg: "bg-blue-500/10",   color: "text-blue-600"   },
  MEMBER_JOINED:     { icon: UserPlus,    bg: "bg-green-500/10",  color: "text-green-700"  },
  PROJECT_CREATED:   { icon: FolderPlus,  bg: "bg-orange-500/10", color: "text-orange-700" },
  MEETING_SCHEDULED: { icon: Calendar,    bg: "bg-pink-500/10",   color: "text-pink-700"   },
};

const FALLBACK = { icon: Clock, bg: "bg-muted", color: "text-muted-foreground" };

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins} min ago`;
  if (hours < 24)  return `${hours} hr ago`;
  if (days  === 1) return "yesterday";
  return `${days} days ago`;
}

export function RecentActivity() {
  const { data: workspaces = [], isLoading: wsLoading } = useWorkspaces();

  const { data: items = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["dashboard-activities", workspaces.map((w) => w.id)],
    queryFn: async () => {
      const results = await Promise.all(
        workspaces.map((ws) =>
          api
            .get<ActivityItem[]>(`/api/activities/workspace/${ws.id}?limit=10`)
            .then((res) =>
              (res?.data ?? []).map((a) => ({ ...a, workspaceName: ws.name }))
            )
            .catch(() => [] as ActivityItem[])
        )
      );

      return results
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    },
    enabled: !wsLoading && workspaces.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const loading = wsLoading || activitiesLoading;

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="text-sm font-medium mb-4">Recent activity</h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 items-start animate-pulse">
              <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2.5 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Activity across all your workspaces will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {items.map((item) => {
            const { icon: Icon, bg, color } = ICON_MAP[item.type] ?? FALLBACK;
            return (
              <div key={item.id} className="flex gap-3 items-start py-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bg}`}>
                  <Icon size={13} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.workspaceName && `${item.workspaceName} · `}
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}