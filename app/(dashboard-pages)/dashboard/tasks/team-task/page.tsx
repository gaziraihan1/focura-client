import { TeamTasksPageContent } from "./TeamTasksPageContent";

export default function TeamTasksPage({
  workspaceId,
}: {
  workspaceId?: string;
}) {
  return <TeamTasksPageContent workspaceId={workspaceId} />;
}