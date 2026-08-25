"use client";

import { WorkspacesContent } from "@/components/dashboard/workspace/list/WorkspacesContent";
import { WorkspaceSearch } from "@/components/dashboard/workspace/list/WorkspaceSearch";
import { WorkspacesHeader } from "@/components/dashboard/workspace/list/WorkspacesHeader";
import { useWorkspacesPage } from "@/hooks/useWorkspacePage";

export function WorkspacesPageContent() {
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
