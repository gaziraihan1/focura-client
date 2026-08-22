import { ActivityPageContent } from "./ActivityPageContent";

interface ActivityPageProps {
  workspaceId: string;
}

export default function ActivityPage({ workspaceId }: ActivityPageProps) {
  return <ActivityPageContent workspaceId={workspaceId} />;
}