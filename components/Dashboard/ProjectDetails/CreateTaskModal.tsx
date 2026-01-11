import React, { useState } from "react";
import {
  X,
  Users,
  Loader2,
  AlertCircle,
  Brain,
  Zap,
  Clock,
} from "lucide-react";
import { CreateTaskDto, useCreateTask } from "@/hooks/useTask";
import Image from "next/image";
import { useProjectRoleCheck } from "@/hooks/useProjects";
import { LabelPicker } from "@/components/Labels/LabelPicker";

interface CreateTaskModalProps {
  projectId: string;
  workspaceId: string; // Add workspaceId prop
  projectMembers: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }>;
  onClose: () => void;
}

type CreateTaskFormData = Required<
  Pick<CreateTaskDto, "title" | "status" | "priority" | "assigneeIds">
> &
  Pick<
    CreateTaskDto,
    | "description"
    | "dueDate"
    | "estimatedHours"
    | "intent"
    | "energyType"
    | "focusRequired"
    | "labelIds" // Add labelIds
  >;

export default function CreateTaskModal({
  projectId,
  workspaceId,
  projectMembers,
  onClose,
}: CreateTaskModalProps) {
  const createTask = useCreateTask();
  const { isManagerOrAdmin } = useProjectRoleCheck(projectId);

  const [formData, setFormData] = useState<CreateTaskFormData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    estimatedHours: undefined,
    assigneeIds: [],
    labelIds: [], // Initialize labelIds
    intent: "EXECUTION",
    energyType: "MEDIUM",
    focusRequired: false,
  });

  const INTENT_OPTIONS = [
    {
      value: "EXECUTION",
      label: "Execution",
      icon: Zap,
      description: "Build, implement, or do hands-on work",
      activeClass: "border-blue-500 bg-blue-500/10 text-blue-500",
    },
    {
      value: "PLANNING",
      label: "Planning",
      icon: Brain,
      description: "Think, design, or organize",
      activeClass: "border-purple-500 bg-purple-500/10 text-purple-500",
    },
    {
      value: "REVIEW",
      label: "Review",
      icon: AlertCircle,
      description: "Validate, QA, or inspect work",
      activeClass: "border-green-500 bg-green-500/10 text-green-500",
    },
    {
      value: "LEARNING",
      label: "Learning",
      icon: Clock,
      description: "Study or research",
      activeClass: "border-amber-500 bg-amber-500/10 text-amber-500",
    },
    {
      value: "COMMUNICATION",
      label: "Communication",
      icon: Users,
      description: "Meetings or discussions",
      activeClass: "border-pink-500 bg-pink-500/10 text-pink-500",
    },
  ] as const;

  const ENERGY_OPTIONS = [
    {
      value: "LOW",
      label: "Low",
      className: "border-green-500 bg-green-500/10 text-green-500",
    },
    {
      value: "MEDIUM",
      label: "Medium",
      className: "border-blue-500 bg-blue-500/10 text-blue-500",
    },
    {
      value: "HIGH",
      label: "High",
      className: "border-red-500 bg-red-500/10 text-red-500",
    },
  ] as const;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleAssignee = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter((id) => id !== userId)
        : [...prev.assigneeIds, userId],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    createTask.mutate(
      {
        ...formData,
        projectId,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  const priorityColors: Record<string, string> = {
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create Project Task
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg border bg-background focus:ring-2 ring-primary ${
                errors.title ? "border-red-500" : "border-border"
              }`}
              placeholder="What needs to be done?"
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex gap-1 mt-1">
                <AlertCircle size={14} /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border bg-background focus:ring-2 ring-primary"
              placeholder="Optional context for this task"
            />
          </div>

          {/* Intent */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <Brain size={14} className="inline mr-1" />
              Task Intent
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTENT_OPTIONS.map((intent) => {
                const Icon = intent.icon;
                const selected = formData.intent === intent.value;

                return (
                  <button
                    key={intent.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, intent: intent.value })
                    }
                    className={`p-3 rounded-lg border text-left transition ${
                      selected
                        ? intent.activeClass
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} />
                      <span className="font-medium text-sm">
                        {intent.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {intent.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              <Zap size={14} className="inline mr-1" />
              Ideal Energy
            </label>

            <div className="grid grid-cols-3 gap-3">
              {ENERGY_OPTIONS.map((energy) => {
                const selected = formData.energyType === energy.value;

                return (
                  <button
                    key={energy.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, energyType: energy.value })
                    }
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                      selected
                        ? energy.className
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {energy.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus + Estimate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.focusRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    focusRequired: e.target.checked,
                  })
                }
                className="rounded border-border"
              />
              Focus required (deep work)
            </label>

            <div>
              <label className="text-sm font-medium mb-1 block">
                <Clock size={14} className="inline mr-1" />
                Estimated Hours
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={formData.estimatedHours ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedHours: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border bg-background focus:ring-2 ring-primary"
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    formData.priority === p
                      ? priorityColors[p]
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            />
          </div>

          {/* Labels */}
          <div>
            <LabelPicker
              workspaceId={workspaceId}
              selectedLabelIds={formData.labelIds || []}
              onChange={(labelIds) =>
                setFormData({ ...formData, labelIds })
              }
              maxLabels={10}
            />
          </div>

          {/* Assignees */}
          {isManagerOrAdmin && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Users size={16} className="inline mr-1" />
                Assign Members
              </label>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {projectMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAssignee(member.userId)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border ${
                      formData.assigneeIds.includes(member.userId)
                        ? "bg-primary/10 border-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {member.user.image ? (
                      <Image
                        src={member.user.image}
                        alt={member.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {member.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createTask.isPending}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createTask.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}