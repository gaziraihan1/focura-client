"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Zap } from "lucide-react";
import { useProjects } from "@/hooks/useProjectQueries";
import {
  useCreateAutomation,
  useUpdateAutomation,
  type AutomationAction,
  type AutomationRule,
  type AutomationTrigger,
} from "@/hooks/useAutomations";
import { STATUS_OPTIONS } from "@/constants/task.constants";

// ─── Draft types (UI-local, converted on submit) ─────────────────────────────

interface AssignUserDraft {
  type: "ASSIGN_USER";
  target: "assigneeUserId" | "email" | "role";
  value: string;
}

interface SetPriorityDraft {
  type: "SET_PRIORITY";
  priority: string;
}

interface NotifyMembersDraft {
  type: "NOTIFY_MEMBERS";
  message: string;
}

type ActionDraft = AssignUserDraft | SetPriorityDraft | NotifyMembersDraft;

interface AutomationRuleFormProps {
  workspaceId: string;
  initial?: AutomationRule | null;
  onDone: () => void;
  onCancel: () => void;
}

const PRIORITY_OPTIONS = [
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const ASSIGN_TARGET_OPTIONS = [
  { value: "assigneeUserId", label: "Specific user ID" },
  { value: "email", label: "Member email" },
  { value: "role", label: "Project owner or the actor" },
] as const;

function emptyActions(initial?: AutomationRule | null): ActionDraft[] {
  if (!initial || initial.actions.length === 0) return [];
  return initial.actions.map((action: AutomationAction) => {
    if (action.type === "ASSIGN_USER") {
      const config = action.config;
      if (config.email) return { type: "ASSIGN_USER", target: "email", value: config.email };
      if (config.role) return { type: "ASSIGN_USER", target: "role", value: config.role };
      return {
        type: "ASSIGN_USER",
        target: "assigneeUserId",
        value: config.assigneeUserId ?? "",
      };
    }
    if (action.type === "SET_PRIORITY") {
      return { type: "SET_PRIORITY", priority: action.config.priority ?? "MEDIUM" };
    }
    return { type: "NOTIFY_MEMBERS", message: action.config.message ?? "" };
  });
}

export function AutomationRuleForm({
  workspaceId,
  initial,
  onDone,
  onCancel,
}: AutomationRuleFormProps) {
  const createAutomation = useCreateAutomation();
  const updateAutomation = useUpdateAutomation();
  const { data: projects = [] } = useProjects(workspaceId);

  const [name, setName] = useState(initial?.name ?? "");
  const [triggerType, setTriggerType] = useState<AutomationTrigger>(
    initial?.triggerType ?? "STATUS_CHANGED",
  );
  const [fromStatus, setFromStatus] = useState(initial?.triggerConfig?.fromStatus ?? "");
  const [toStatus, setToStatus] = useState(initial?.triggerConfig?.toStatus ?? "");
  const [projectId, setProjectId] = useState(initial?.triggerConfig?.projectId ?? "");
  const [actions, setActions] = useState<ActionDraft[]>(() => emptyActions(initial));
  const [error, setError] = useState("");

  const isPending = createAutomation.isPending || updateAutomation.isPending;

  const addAction = () => {
    setActions((prev) => [
      ...prev,
      { type: "SET_PRIORITY", priority: "MEDIUM" },
    ]);
  };

  const removeAction = (index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, draft: ActionDraft) => {
    setActions((prev) => prev.map((action, i) => (i === index ? draft : action)));
  };

  const toPayload = (): { actions: AutomationAction[] } => {
    const payload = actions.map((action): AutomationAction => {
      if (action.type === "ASSIGN_USER") {
        return {
          type: "ASSIGN_USER",
          config:
            action.target === "email"
              ? { email: action.value || null }
              : action.target === "role"
                ? { role: (action.value || "actor") as "project-owner" | "actor" }
                : { assigneeUserId: action.value || null },
        };
      }
      if (action.type === "SET_PRIORITY") {
        return {
          type: "SET_PRIORITY",
          config: { priority: action.priority as "URGENT" | "HIGH" | "MEDIUM" | "LOW" },
        };
      }
      return {
        type: "NOTIFY_MEMBERS",
        config: { message: action.message.trim() || null },
      };
    });
    return { actions: payload };
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) {
      setError("Give your rule a name.");
      return;
    }
    if (actions.length === 0) {
      setError("Add at least one action.");
      return;
    }
    if (actions.some((action) => action.type === "ASSIGN_USER" && !action.value.trim())) {
      setError("Every ASSIGN_USER action needs a user ID, email, or role target.");
      return;
    }

    const triggerConfig =
      triggerType === "STATUS_CHANGED"
        ? { fromStatus: fromStatus || null, toStatus: toStatus || null }
        : { projectId: projectId || null };

    const base = {
      name: name.trim(),
      triggerType,
      triggerConfig,
      ...toPayload(),
    };

    if (initial) {
      await updateAutomation.mutateAsync({ id: initial.id, ...base });
    } else {
      await createAutomation.mutateAsync({ workspaceId, ...base });
    }
    onDone();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            {initial ? "Edit rule" : "New rule"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            When the trigger fires, Focura runs the actions below.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="automation-name"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Rule name
          </label>
          <input
            id="automation-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Auto-assign when moved to In Review"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Trigger */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="automation-trigger"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Trigger
            </label>
            <select
              id="automation-trigger"
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as AutomationTrigger)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="STATUS_CHANGED">When a task status changes</option>
              <option value="TASK_CREATED">When a task is created</option>
            </select>
          </div>

          {triggerType === "STATUS_CHANGED" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="automation-from"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  From status
                </label>
                <select
                  id="automation-from"
                  value={fromStatus}
                  onChange={(e) => setFromStatus(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Any</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="automation-to"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  To status
                </label>
                <select
                  id="automation-to"
                  value={toStatus}
                  onChange={(e) => setToStatus(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Any</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="automation-project"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Project (optional)
              </label>
              <select
                id="automation-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Any project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Actions ({actions.length}/5)
            </span>
            <button
              type="button"
              onClick={addAction}
              disabled={actions.length >= 5}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add action
            </button>
          </div>

          {actions.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
              No actions yet — add one to make this rule do something.
            </p>
          )}

          <div className="space-y-2.5">
            {actions.map((action, index) => (
              <ActionRow
                key={index}
                action={action}
                onChange={(draft) => updateAction(index, draft)}
                onRemove={() => removeAction(index)}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {initial ? "Save changes" : "Create rule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action row ───────────────────────────────────────────────────────────────

interface ActionRowProps {
  action: ActionDraft;
  onChange: (draft: ActionDraft) => void;
  onRemove: () => void;
}

function ActionRow({ action, onChange, onRemove }: ActionRowProps) {
  if (action.type === "ASSIGN_USER") {
    return (
      <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 p-3">
        <div className="min-w-[150px]">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Action
          </label>
          <select
            value="ASSIGN_USER"
            onChange={() => {}}
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
          >
            <option value="ASSIGN_USER">Assign a user</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Assign to
          </label>
          <select
            value={action.target}
            onChange={(e) =>
              onChange({
                ...action,
                target: e.target.value as AssignUserDraft["target"],
              })
            }
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
          >
            {ASSIGN_TARGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            {action.target === "email"
              ? "Email"
              : action.target === "role"
                ? "Role (or leave blank for actor)"
                : "User ID"}
          </label>
          <input
            type="text"
            value={action.value}
            onChange={(e) => onChange({ ...action, value: e.target.value })}
            placeholder={
              action.target === "role" ? "project-owner" : action.target === "email" ? "dev@team.com" : "user id"
            }
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label="Remove action"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (action.type === "SET_PRIORITY") {
    return (
      <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 p-3">
        <div className="min-w-[150px]">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Action
          </label>
          <select
            value="SET_PRIORITY"
            onChange={() => {}}
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
          >
            <option value="SET_PRIORITY">Set priority</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Priority
          </label>
          <select
            value={action.priority}
            onChange={(e) => onChange({ ...action, priority: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label="Remove action"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 p-3">
      <div className="min-w-[150px]">
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
          Action
        </label>
        <select
          value="NOTIFY_MEMBERS"
          onChange={() => {}}
          className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
        >
          <option value="NOTIFY_MEMBERS">Notify members</option>
        </select>
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
          Message (optional)
        </label>
        <input
          type="text"
          value={action.message}
          onChange={(e) => onChange({ ...action, message: e.target.value })}
          placeholder="e.g., Please review this task"
          className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        aria-label="Remove action"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
