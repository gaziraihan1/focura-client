import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { serverApi } from "@/lib/api/server";
import { DashboardGreeting } from "@/components/Dashboard/DashboardGreeting";
import { QuickActions } from "@/components/Dashboard/QuickActions";
import { WorkspaceList } from "@/components/Dashboard/WorkspaceList";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { FocuraTips } from "@/components/Dashboard/FocuraTips";
import type { Workspace } from "@/hooks/useWorkspace";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/authentication/login");

  // Only one lightweight fetch — no per-workspace data needed
  const workspaces = await serverApi<Workspace[]>("/api/workspaces");

  return (
    <div className="space-y-6 py-2">
      <DashboardGreeting userName={session.user?.name} />
      <QuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WorkspaceList workspaces={workspaces ?? []} />
        <RecentActivity />
      </div>
      <FocuraTips />
    </div>
  );
}