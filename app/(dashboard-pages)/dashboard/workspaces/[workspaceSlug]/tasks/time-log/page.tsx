import { WorkspaceTimeLogView } from "@/components/dashboard/tasks/time-log/WorkspaceTimeLogView";

export default async function WorkspaceTimeLogPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <WorkspaceTimeLogView workspaceSlug={workspaceSlug} />;
}
