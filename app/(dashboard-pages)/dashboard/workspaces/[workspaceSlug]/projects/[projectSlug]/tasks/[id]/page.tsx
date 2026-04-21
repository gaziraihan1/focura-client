// app/dashboard/workspaces/[workspaceSlug]/tasks/[id]/page.tsx
import { TaskDetailsClient } from "@/components/Dashboard/TaskDetails/TaskDetailsClient";
import { use } from "react";

// params are available server-side in App Router — no need for useParams
export default function WorkspaceTaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string; workspaceSlug: string }>;
}) {
  const {id, workspaceSlug} = use(params);
  return (
    <TaskDetailsClient
      id={id}
      workspaceSlug={workspaceSlug}
    />
  );
}