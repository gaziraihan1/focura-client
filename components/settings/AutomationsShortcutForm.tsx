"use client";

import Link from "next/link";
import { Zap, ChevronRight, Loader2 } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaceQueries";

/**
 * Global-settings entry point for Automations. Rules are workspace-level, so
 * this page just routes the user to the Automations tab of the workspace
 * settings of their choice — the full rule builder lives there.
 */
export function AutomationsShortcutForm() {
  const { data: workspaces = [], isLoading } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Automations</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Automation rules are workspace-level. Choose a workspace to
              manage its rules.
            </p>
          </div>
        </div>

        {workspaces.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workspaces yet — create a workspace first, then set up
            automation rules there.
          </p>
        ) : (
          <ul className="space-y-2">
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <Link
                  href={`/dashboard/workspaces/${workspace.slug}/settings?tab=automations`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {workspace.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Manage automation rules
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
