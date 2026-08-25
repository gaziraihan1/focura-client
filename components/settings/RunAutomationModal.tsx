"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Search, X, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import {
  useTestAutomation,
  type AutomationRule,
} from "@/hooks/useAutomations";

interface TaskOption {
  id: string;
  title: string;
}

interface RunAutomationModalProps {
  rule: AutomationRule | null;
  workspaceId: string;
  onClose: () => void;
}

/**
 * "Run now" modal — lets a workspace admin execute a rule against a chosen
 * task from the workspace, using POST /api/v1/automations/:id/test.
 */
export function RunAutomationModal({
  rule,
  workspaceId,
  onClose,
}: RunAutomationModalProps) {
  const [taskId, setTaskId] = useState("");
  const [search, setSearch] = useState("");
  const testAutomation = useTestAutomation();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["automation-test-tasks", workspaceId],
    queryFn: async () => {
      const res = await api.get<{ data: TaskOption[] }>("/api/v1/tasks", {
        params: { workspaceId, pageSize: 50 },
        showErrorToast: false,
      });
      return res?.data?.data ?? [];
    },
    enabled: Boolean(rule && workspaceId),
  });

  if (!rule) return null;

  const trimmed = search.trim().toLowerCase();
  const filtered = trimmed
    ? tasks.filter((task) => task.title.toLowerCase().includes(trimmed))
    : tasks;

  const handleRun = async () => {
    if (!taskId) return;
    await testAutomation.mutateAsync({ id: rule.id, taskId });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-popover p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Play className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Run rule</h3>
              <p className="text-xs text-muted-foreground">{rule.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          Pick a task from this workspace — the rule&apos;s actions will be
          applied to it immediately.
        </p>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No tasks found
            </p>
          ) : (
            <ul>
              {filtered.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => setTaskId(task.id)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent ${
                      taskId === task.id ? "bg-primary/10 font-medium" : ""
                    }`}
                  >
                    {task.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={!taskId || testAutomation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {testAutomation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {testAutomation.isPending ? "Running..." : "Run rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
