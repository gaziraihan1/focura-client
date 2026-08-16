"use client";

import { use } from "react";
import { WorkspaceTimeLogView } from "@/components/Dashboard/Tasks/WorkspaceTimeLogView";

export default function WorkspaceTimeLogPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = use(params);
  return <WorkspaceTimeLogView workspaceSlug={workspaceSlug} />;
}
