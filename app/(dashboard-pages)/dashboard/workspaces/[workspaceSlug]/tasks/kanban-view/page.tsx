import { KanbanPageContent } from "./KanbanPageContent";

export default async function WorkspaceKanbanPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <KanbanPageContent workspaceSlug={workspaceSlug} />;
}