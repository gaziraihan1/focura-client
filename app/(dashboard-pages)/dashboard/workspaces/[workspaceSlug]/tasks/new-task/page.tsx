"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Calendar,
  Flag,
  Users,
  Tag,
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useProjects } from "@/hooks/useProjects";
import { useWorkspaceMembers } from "@/hooks/useWorkspace";
import { useLabels } from "@/hooks/useLabels";

type TaskFormData = Omit<CreateTaskDto, "workspaceId">;

export default function WorkspaceNewTaskPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceSlug);
  const { data: projects = [], isLoading: projectsLoading } = useProjects(workspace?.id);
  const { data: members = [], isLoading: membersLoading } = useWorkspaceMembers(workspace?.id);
  const { data: labels = [], isLoading: labelsLoading } = useLabels(workspace?.id);
  
  const createTaskMutation = useCreateTask();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    projectId: "",
    status: "TODO",
    priority: "MEDIUM",
    startDate: "",
    dueDate: "",
    estimatedHours: undefined,
    assigneeIds: [],
    labelIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project";
    }

    if (formData.startDate && formData.dueDate) {
      if (new Date(formData.startDate) > new Date(formData.dueDate)) {
        newErrors.dueDate = "Due date must be after start date";
      }
    }

    if (
      formData.estimatedHours !== undefined &&
      (isNaN(Number(formData.estimatedHours)) ||
        Number(formData.estimatedHours) < 0)
    ) {
      newErrors.estimatedHours = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !workspace) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        ...formData,
        workspaceId: workspace.id,
        projectId: formData.projectId || null,
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : null,
      });
      router.push(`/dashboard/${workspaceSlug}/tasks`);
    } catch (error) {
      console.error("Create task error:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks`);
  };

  const toggleAssignee = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds?.includes(userId)
        ? prev.assigneeIds.filter((id) => id !== userId)
        : [...(prev.assigneeIds || []), userId],
    }));
  };

  const toggleLabel = (labelId: string) => {
    setFormData((prev) => ({
      ...prev,
      labelIds: prev.labelIds?.includes(labelId)
        ? prev.labelIds.filter((id) => id !== labelId)
        : [...(prev.labelIds || []), labelId],
    }));
  };

  const priorityColors = {
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const isLoading = createTaskMutation.isPending || workspaceLoading;

  if (workspaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Workspace not found</h2>
        <p className="text-muted-foreground mb-6">
          Unable to load workspace information
        </p>
        <button
          onClick={() => router.push("/dashboard/workspaces")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Workspaces
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-accent transition"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Task</h1>
            <p className="text-muted-foreground mt-1">
              Add a task to {workspace.name}
            </p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-accent transition"
        >
          <X size={24} className="text-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card border border-border p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Basic Information
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none transition ${
                errors.title ? "border-red-500" : "border-border"
              }`}
              placeholder="Enter task title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition"
              placeholder="Add a detailed description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FileText size={16} className="inline mr-2" />
              Project <span className="text-red-500">*</span>
            </label>
            {projectsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin" size={16} />
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  No projects available. Create a project first.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/${workspaceSlug}/projects/new`)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Create Project
                </button>
              </div>
            ) : (
              <>
                <select
                  value={formData.projectId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, projectId: e.target.value }))
                  }
                  className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                    errors.projectId ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.projectId}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Task Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ 
                    ...prev, 
                    status: e.target.value as CreateTaskDto['status'] 
                  }))
                }
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Flag size={16} className="inline mr-2" />
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map(
                  (priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, priority }))
                      }
                      className={`px-4 py-2.5 rounded-lg border transition text-sm font-medium ${
                        formData.priority === priority
                          ? priorityColors[priority]
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {priority}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar size={16} className="inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar size={16} className="inline mr-2" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                  errors.dueDate ? "border-red-500" : "border-border"
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Clock size={16} className="inline mr-2" />
              Estimated Hours
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.estimatedHours || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedHours: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none ${
                errors.estimatedHours ? "border-red-500" : "border-border"
              }`}
              placeholder="e.g., 8"
            />
            {errors.estimatedHours && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.estimatedHours}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card border border-border p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Team & Labels
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <Users size={16} className="inline mr-2" />
              Assignees
            </label>
            {membersLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin" size={16} />
                Loading team members...
              </div>
            ) : members.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <button
                    key={member.user.id}
                    type="button"
                    onClick={() => toggleAssignee(member.user.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                      formData.assigneeIds?.includes(member.user.id)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                      {member.user.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm">{member.user.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No team members available</p>
            )}
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <Tag size={16} className="inline mr-2" />
              Labels
            </label>
            {labelsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin" size={16} />
                Loading labels...
              </div>
            ) : labels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      formData.labelIds?.includes(label.id)
                        ? "opacity-100 ring-2 ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                      border: `1px solid ${label.color}40`,
                    }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  No labels available. Create labels in workspace settings.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/${workspaceSlug}/settings`)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Manage Labels
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-end gap-3 pb-6"
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || projects.length === 0}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Task
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}