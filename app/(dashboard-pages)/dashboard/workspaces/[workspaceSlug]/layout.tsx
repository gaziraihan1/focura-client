import { WorkspacePlanProvider } from "@/context/workspacePlan/WorkspacePlanContext";
import { WorkspaceLayoutShell } from "./WorkspaceLayoutShell";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return (
    <WorkspacePlanProvider slug={workspaceSlug}>
      <WorkspaceLayoutShell slug={workspaceSlug}>
        {children}
      </WorkspaceLayoutShell>
    </WorkspacePlanProvider>
  );
}