"use client";

import { useMemo, useState } from "react";
import { Zap, Plus, Loader2, Pencil, Trash2, Calendar, Play, Folder } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaceQueries";
import {
  useAutomations,
  useUpdateAutomation,
  useDeleteAutomation,
  useTestAutomation,
  type AutomationAction,
  type AutomationRule,
} from "@/hooks/useAutomations";
import { AutomationRuleForm } from "@/components/settings/AutomationRuleForm";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { RunAutomationModal } from "@/components/settings/RunAutomationModal";
import { useProjects } from "@/hooks/useProjectQueries";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceQueries";
import { useLabels } from "@/hooks/useLabels";
import { STATUS_LABELS } from "@/constants/task.constants";

const TRIGGER_LABELS: Record<string, string> = {
  STATUS_CHANGED: "Task status changes",
  TASK_CREATED: "Task created",
  DUE_DATE_APPROACHING: "Task due date is approaching",
  ASSIGNEE_CHANGED: "Someone is assigned to a task",
  LABEL_ADDED: "A label is added to a task",
  MENTION: "A member is mentioned in a comment",
};

const PRIORITY_LABELS: Record<string, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

function formatDate(value: string | null): string {
  if (!value) return "Never run";
  return new Date(value).toLocaleString();
}

function describeTrigger(
  rule: AutomationRule,
  memberNameMap: Map<string, string>,
  labelNameMap: Map<string, string>,
): string {
  if (rule.triggerType === "STATUS_CHANGED") {
    const from = rule.triggerConfig?.fromStatus;
    const to = rule.triggerConfig?.toStatus;
    const fromLabel = from ? STATUS_LABELS[from] ?? from : "any status";
    const toLabel = to ? STATUS_LABELS[to] ?? to : "any status";
    return `${fromLabel} → ${toLabel}`;
  }
  if (rule.triggerType === "DUE_DATE_APPROACHING") {
    const daysBefore = rule.triggerConfig?.daysBefore ?? 3;
    return `due within ${daysBefore} day${daysBefore === 1 ? "" : "s"}`;
  }
  if (rule.triggerType === "ASSIGNEE_CHANGED") {
    const id = rule.triggerConfig?.assigneeUserId;
    return id ? `when ${memberNameMap.get(id) ?? "a member"} is assigned` : "when anyone is assigned";
  }
  if (rule.triggerType === "LABEL_ADDED") {
    const id = rule.triggerConfig?.labelId;
    return id ? `when ${labelNameMap.get(id) ?? "a label"} is added` : "when any label is added";
  }
  if (rule.triggerType === "MENTION") {
    const id = rule.triggerConfig?.mentionedUserId;
    return id
      ? `when ${memberNameMap.get(id) ?? "a member"} is mentioned`
      : "when anyone is mentioned";
  }
  return rule.triggerConfig?.projectId ? "in a specific project" : "in any project";
}

function describeActions(
  actions: AutomationAction[],
  memberNameMap: Map<string, string>,
): string {
  return actions
    .map((action) => {
      if (action.type === "ASSIGN_USER") {
        const config = action.config;
        if (config.role === "project-owner") return "Assign project owner";
        if (config.role === "actor") return "Assign the actor";
        if (config.email) return `Assign ${config.email}`;
        if (config.assigneeUserId)
          return `Assign ${memberNameMap.get(config.assigneeUserId) ?? "a member"}`;
        return "Assign user";
      }
      if (action.type === "SET_PRIORITY") {
        const label = PRIORITY_LABELS[action.config.priority ?? ""] ?? action.config.priority;
        return `Set priority: ${label}`;
      }
      return "Notify members";
    })
    .join(", ");
}

export function AutomationsSettingsForm({
  workspaceId: fixedWorkspaceId,
}: { workspaceId?: string } = {}) {
  const { data: workspaces = [], isLoading: loadingWorkspaces } = useWorkspaces();
  const [workspaceId, setWorkspaceId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<AutomationRule | null>(null);
  const [pendingRuleId, setPendingRuleId] = useState<string | null>(null);
  const [runRule, setRunRule] = useState<AutomationRule | null>(null);

  // Embedded in workspace settings the workspace is fixed by the URL; in
  // global settings the user picks one via the selector below.
  const isFixed = Boolean(fixedWorkspaceId);
  const selectedWorkspaceId = useMemo(
    () => fixedWorkspaceId || workspaceId || workspaces[0]?.id || "",
    [fixedWorkspaceId, workspaceId, workspaces],
  );

  const testAutomation = useTestAutomation();
  const { data: projects = [] } = useProjects(selectedWorkspaceId);
  const { data: members = [] } = useWorkspaceMembers(selectedWorkspaceId);
  const { data: labelsResponse } = useLabels({ limit: 100 });
  const labels = labelsResponse?.data ?? [];

  const projectNameMap = useMemo(
    () => new Map(projects.map((p) => [p.id, p.name])),
    [projects],
  );
  const memberNameMap = useMemo(
    () =>
      new Map(
        members.map((m) => [
          m.userId,
          m.user?.name || m.user?.email || m.userId,
        ]),
      ),
    [members],
  );
  const labelNameMap = useMemo(
    () => new Map(labels.map((l) => [l.id, l.name])),
    [labels],
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
    setPendingRuleId(rule.id);
    updateAutomation.mutate(
      { id: rule.id, enabled: !rule.enabled },
      { onSettled: () => setPendingRuleId(null) },
    );
  };

  const handleDeleteConfirm = async () => {
    if (!ruleToDelete) return;
    await deleteAutomation.mutateAsync(ruleToDelete.id);
    setRuleToDelete(null);
  };

  if (!isFixed && loadingWorkspaces) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isFixed && workspaces.length === 0) {
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
          <Button
            type="button"
            onClick={openCreate}
            disabled={!selectedWorkspaceId}
            leftIcon={<Plus className="h-4 w-4" />}
            variant="primary"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 sm:self-auto"
          >
            New rule
          </Button>
        </div>

        {!isFixed && (
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
        )}
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
              projectName={rule.projectId ? projectNameMap.get(rule.projectId) ?? null : null}
              isPending={pendingRuleId === rule.id}
              isRunning={testAutomation.isPending && runRule?.id === rule.id}
              onToggle={() => handleToggle(rule)}
              onEdit={() => openEdit(rule)}
              onDelete={() => setRuleToDelete(rule)}
              onRun={() => setRunRule(rule)}
              actionSummary={describeActions(rule.actions, memberNameMap)}
              triggerSummary={describeTrigger(rule, memberNameMap, labelNameMap)}
            />
          ))}
        </div>
      )}

      <RunAutomationModal
        rule={runRule}
        workspaceId={selectedWorkspaceId}
        onClose={() => setRunRule(null)}
      />

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
  projectName?: string | null;
  actionSummary: string;
  triggerSummary: string;
  isPending: boolean;
  isRunning: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRun: () => void;
}

function RuleCard({
  rule,
  projectName,
  actionSummary,
  triggerSummary,
  isPending,
  isRunning,
  onToggle,
  onEdit,
  onDelete,
  onRun,
}: RuleCardProps) {
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
            {projectName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <Folder className="h-2.5 w-2.5" />
                {projectName}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              <span className="font-medium text-foreground/80">
                {TRIGGER_LABELS[rule.triggerType] ?? rule.triggerType}
              </span>{" "}
              · {triggerSummary}
            </span>
            <span>{actionSummary}</span>
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
          <Button
            type="button"
            onClick={onRun}
            disabled={isRunning}
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
            aria-label={`Run ${rule.name} now`}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={onEdit}
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label={`Edit ${rule.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            aria-label={`Delete ${rule.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
