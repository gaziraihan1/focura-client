import { TaskDetailsPageContent } from "./TaskDetailsPageContent";

export default async function WorkspaceTaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string; workspaceSlug: string }>;
}) {
  const { id, workspaceSlug } = await params;
  return (
    <TaskDetailsPageContent
      id={id}
      workspaceSlug={workspaceSlug ?? ""}
    />
  );
}
