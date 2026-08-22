import { NewTaskPageContent } from "./NewTaskPageContent";

export default async function WorkspaceNewTaskPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return <NewTaskPageContent workspaceSlug={workspaceSlug} />;
}
