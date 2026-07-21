"use client";

import dynamic from "next/dynamic";
import { use } from "react";

const TaskDetailsClient = dynamic(
  () => import("@/components/Dashboard/TaskDetails/TaskDetailsClient").then((m) => m.TaskDetailsClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function WorkspaceTaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string; workspaceSlug: string }>;
}) {
  const { id, workspaceSlug } = use(params);
  return (
    <TaskDetailsClient
      id={id}
      workspaceSlug={workspaceSlug ?? ""}
    />
  );
}
