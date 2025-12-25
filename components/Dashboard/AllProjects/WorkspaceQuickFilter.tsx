// components/Projects/WorkspaceQuickFilter.tsx
"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { WorkspaceData } from "@/types/project.types";

interface WorkspaceQuickFilterProps {
  workspaces: WorkspaceData[];
  selectedWorkspaceId: string;
  onSelectWorkspace: (workspaceId: string) => void;
}

export function WorkspaceQuickFilter({
  workspaces,
  selectedWorkspaceId,
  onSelectWorkspace,
}: WorkspaceQuickFilterProps) {
  if (workspaces.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-6"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Building2 size={16} />
        <span className="font-medium">Filter by Workspace:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectWorkspace("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            selectedWorkspaceId === "all"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card border border-border hover:bg-accent"
          }`}
        >
          All Workspaces
        </button>
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => onSelectWorkspace(workspace.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedWorkspaceId === workspace.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border hover:bg-accent"
            }`}
          >
            {workspace.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}