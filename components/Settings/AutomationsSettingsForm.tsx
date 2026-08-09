"use client";

import { useMemo, useState } from "react";
import { Zap, Plus, Loader2, Pencil, Trash2, Calendar } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaceQueries";
import {
  useAutomations,
  useUpdateAutomation,
  useDeleteAutomation,
  type AutomationAction,
  type AutomationRule,
} from "@/hooks/useAutomations";
import { AutomationRuleForm } from "@/components/Settings/AutomationRuleForm";
import { ConfirmModal } from "@/components/Shared/ConfirmModal";
import { STATUS_LABELS } from "@/constants/task.constants";

const TRIGGER_LABELS: Record<string, string> = {
  STATUS_CHANGED: "Task status changes",
  TASK_CREATED: "Task created",
};

const ACTION_LABELS: Record<string, string> = {
  ASSIGN_USER: "Assign user",
  SET_PRIORITY: "Set priority",
  NOTIFY_MEMBERS: "Notify members",
};

function formatDate(value: string | null): string {
  if (!value) return "Never run";
  return new Date(value).toLocaleString();
}

function describeTrigger(rule: AutomationRule): string {
  if (rule.triggerType === "STATUS_CHANGED") {
    const from = rule.triggerConfig?.fromStatus;
    const to = rule.triggerConfig?.toStatus;
    const fromLabel = from ? STATUS_LABELS[from] ?? from : "any status";
    const toLabel = to ? STATUS_LABELS[to] ?? to : "any status";
    return `${fromLabel} → ${toLabel}`;
  }
  return rule.triggerConfig?.projectId ? "in a specific project" : "in any project";
}

function describeActions(actions: AutomationAction[]): string {
  return actions.map((action) => ACTION_LABELS[action.type] ?? action.type).join(", ");
}

export function AutomationsSettingsForm() {
  const { data: workspaces = [], isLoading: loadingWorkspaces } = useWorkspaces();
  const [workspaceId, setWorkspaceId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<AutomationRule | null>(null);

  const selectedWorkspaceId = useMemo(
    () => workspaceId || workspaces[0]?.id || "",
    [workspaceId, workspaces],
  );

  const { data: rules = [], isLoading: loadingRules } = useAutomations(selectedWorkspaceId);
  const updateAutomation = useUpdateAutomation();
  const deleteAutomation = useDeleteAutomation();

  const openCreate = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const openEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  const handleToggle = (rule: AutomationRule) => {
    updateAutomation.mutate({ id: rule.id, enabled: !rule.enabled });
  };

  const handleDeleteConfirm = async () => {
    if (!ruleToDelete) return;
    await deleteAutomation.mutateAsync(ruleToDelete.id);
    setRuleToDelete(null);
  };

  if (loadingWorkspaces) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Zap className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold">No workspaces yet</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          Automations are workspace-level rules. Create a workspace first, then
          come back to set up automation rules.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Automations</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Save time by automating repetitive work — {rules.length} rule
                {rules.length === 1 ? "" : "s"} in this workspace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            disabled={!selectedWorkspaceId}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            New rule
          </button>
        </div>

        <div className="mt-4">
          <label
            htmlFor="automation-workspace"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Workspace
          </label>
          <select
            id="automation-workspace"
            value={selectedWorkspaceId}
            onChange={(e) => {
              setWorkspaceId(e.target.value);
              closeForm();
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:max-w-xs"
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rule builder */}
      {showForm && selectedWorkspaceId && (
        <AutomationRuleForm
          workspaceId={selectedWorkspaceId}
          initial={editingRule}
          onDone={closeForm}
          onCancel={closeForm}
        />
      )}

      {/* Rules list */}
      {loadingRules ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm font-medium">No automation rules yet</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Create your first rule, e.g. &quot;when a task moves to In Review,
            assign the project owner&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              isPending={updateAutomation.isPending}
              onToggle={() => handleToggle(rule)}
              onEdit={() => openEdit(rule)}
              onDelete={() => setRuleToDelete(rule)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(ruleToDelete)}
        onClose={() => setRuleToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete automation rule"
        message={`Are you sure you want to delete "${ruleToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete rule"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteAutomation.isPending}
      />
    </div>
  );
}

// ─── Rule card ────────────────────────────────────────────────────────────────

interface RuleCardProps {
  rule: AutomationRule;
  isPending: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function RuleCard({ rule, isPending, onToggle, onEdit, onDelete }: RuleCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5">
          <Zap className="h-5 w-5 text-foreground/70" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold tracking-tight">{rule.name}</p>
            {!rule.enabled && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Paused
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              <span className="font-medium text-foreground/80">
                {TRIGGER_LABELS[rule.triggerType] ?? rule.triggerType}
              </span>{" "}
              · {describeTrigger(rule)}
            </span>
            <span>{describeActions(rule.actions)}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {rule.runCount} run{rule.runCount === 1 ? "" : "s"} · {formatDate(rule.lastRunAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <label className="relative inline-flex cursor-pointer items-center" aria-label={`Toggle ${rule.name}`}>
            <input
              type="checkbox"
              role="switch"
              className="peer sr-only"
              checked={rule.enabled}
              onChange={onToggle}
              disabled={isPending}
            />
            <div className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-disabled:opacity-50" />
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5" />
          </label>
          <button
            type="button"
            onClick={onEdit}
            className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label={`Edit ${rule.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            aria-label={`Delete ${rule.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
