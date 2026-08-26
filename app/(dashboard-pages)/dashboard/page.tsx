import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { authOptions } from "@/lib/auth/authOptions";
import { serverApi } from "@/lib/api/server";
import { workspaceKeys } from "@/hooks/workspaceKeys";
import { DashboardGreeting } from "@/components/dashboard/home/DashboardGreeting";
import { QuickActions } from "@/components/dashboard/home/QuickActions";
import { WorkspaceList } from "@/components/dashboard/home/WorkspaceList";
import { RecentActivity } from "@/components/dashboard/home/RecentActivity";
import { FocuraTips } from "@/components/dashboard/wellness/FocuraTips";
import { WellnessRecommendations } from "@/components/dashboard/wellness/WellnessRecommendations";
import { FocusStreakBadge } from "@/components/dashboard/wellness/FocusStreakBadge";
import { GettingStartedChecklist } from "@/components/dashboard/home/GettingStartedChecklist";
import { TaskHighlights } from "@/components/dashboard/home/TaskHighlights";
import type { Workspace } from "@/hooks/useWorkspace";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/authentication/login");

  // Only one lightweight fetch — no per-workspace data needed
  const workspaces = await serverApi<Workspace[]>("/api/v1/workspaces");
  const wsList = workspaces ?? [];
  const totalProjects = wsList.reduce((sum, ws) => sum + (ws._count?.projects ?? 0), 0);
  const totalMembers = wsList.reduce((sum, ws) => sum + (ws._count?.members ?? 0), 0);

  // Seed the client react-query cache with the server-fetched list so
  // client components using useWorkspaces() render instantly instead of
  // re-requesting the same endpoint after hydration.
  const queryClient = new QueryClient();
  queryClient.setQueryData(workspaceKeys.lists(), wsList);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <div className="space-y-5 py-2 2xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Hero greeting with stats */}
      <DashboardGreeting
        userName={session.user?.name}
        workspaceCount={wsList.length}
      />

      {/* Quick actions */}
      <QuickActions />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          <WorkspaceList workspaces={wsList} />
          <TaskHighlights />
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-5">
          <FocusStreakBadge />
          <GettingStartedChecklist
            workspaces={wsList.map(ws => ({ id: ws.id, name: ws.name, slug: ws.slug }))}
            totalProjects={totalProjects}
            totalMembers={totalMembers}
          />
          <RecentActivity />
        </div>
      </div>

      {/* Bottom section: tips and wellness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FocuraTips />
        <WellnessRecommendations />
      </div>
    </div>
    </HydrationBoundary>
  );
}