import { Loader2, AlertCircle, FolderKanban } from "lucide-react";
import { WorkspaceGrid } from "./WorkspaceGrid";
import { Workspace } from "@/hooks/useWorkspace";

interface WorkspacesContentProps {
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  filteredWorkspaces: Workspace[];
}

export function WorkspacesContent({
  isLoading,
  isError,
  searchQuery,
  filteredWorkspaces,
}: WorkspacesContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 rounded-xl bg-card border">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Failed to load workspaces</p>
      </div>
    );
  }

  if (filteredWorkspaces.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-card border">
        <FolderKanban className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold">
          {searchQuery ? "No workspaces found" : "No workspaces yet"}
        </h3>
      </div>
    );
  }

  return <WorkspaceGrid workspaces={filteredWorkspaces} />;
}
