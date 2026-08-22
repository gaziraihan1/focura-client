import { TasksPageContent } from "./TasksPageContent";

export default async function WorkspaceTasksPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <TasksPageContent workspaceSlug={workspaceSlug} />;
}
