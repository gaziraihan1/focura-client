"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Save,
  Calendar,
  Flag,
  Palette,
} from "lucide-react";
import toast from "react-hot-toast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { CreateProjectDto, useCreateProject } from "@/hooks/useProjects";

type ProjectForm = Omit<CreateProjectDto, "workspaceId">;

const statusOptions: CreateProjectDto["status"][] = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];

const priorityOptions: CreateProjectDto["priority"][] = [
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
];

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  // undefined: "border-border",
};

const validateHex = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

export default function WorkspaceNewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceSlug);
  const createProject = useCreateProject();

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    color: "#667eea",
    icon: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    startDate: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSubmitting = createProject.isPending || workspaceLoading;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (form.name.length > 100) next.name = "Name must be <= 100 characters";
    if (form.color && !validateHex(form.color)) next.color = "Use hex color like #667eea";
    if (form.startDate && form.dueDate) {
      if (new Date(form.startDate) > new Date(form.dueDate)) {
        next.dueDate = "Due date must be after start date";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) {
      toast.error("Workspace not found");
      return;
    }
    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }
    try {
      await createProject.mutateAsync({
        ...form,
        workspaceId: workspace.id,
      });
      router.push(`/dashboard/workspaces/${workspaceSlug}/projects`);
    } catch (error) {
      console.error("Create project error", error);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/projects`);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-accent transition"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Project</h1>
            <p className="text-muted-foreground mt-1">
              Projects in this workspace are only visible here
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card border border-border p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Basic Info
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none transition ${
                  errors.name ? "border-red-500" : "border-border"
                }`}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition"
                placeholder="Add a short description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Palette size={16} className="inline mr-2" />
                  Color (hex)
                </label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                    errors.color ? "border-red-500" : "border-border"
                  }`}
                  placeholder="#667eea"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.color}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Icon (optional)
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                  placeholder="e.g., 📁"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value as CreateProjectDto["status"] }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status?.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
              Planning
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, priority }))}
                    className={`px-4 py-2.5 rounded-lg border transition text-sm font-medium ${
                      form.priority === priority
                        ? priorityColors[priority as string ]
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Flag size={14} className="inline mr-2" />
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar size={16} className="inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
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
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-end gap-3 pb-6"
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Project
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
