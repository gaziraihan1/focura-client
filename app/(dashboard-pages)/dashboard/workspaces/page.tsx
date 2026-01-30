"use client";

import { WorkspacesContent } from "@/components/Dashboard/Workspaces/Workspaces/WorkspacesContent";
import { WorkspaceSearch } from "@/components/Dashboard/Workspaces/Workspaces/WorkspaceSearch";
import { WorkspacesHeader } from "@/components/Dashboard/Workspaces/Workspaces/WorkspacesHeader";
import { useWorkspacesPage } from "@/hooks/useWorkspacePage";

export default function WorkspacesPage() {
  const state = useWorkspacesPage();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <WorkspacesHeader onCreate={state.navigateToCreate} />
      <WorkspaceSearch
        value={state.searchQuery}
        onChange={state.setSearchQuery}
      />
      <WorkspacesContent {...state} />
    </div>
  );
}
