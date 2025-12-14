"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Calendar,
  Flag,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";

export default function AddTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO" as CreateTaskDto['status'],
    priority: "MEDIUM" as CreateTaskDto['priority'],
    startDate: "",
    dueDate: "",
    estimatedHours: undefined as number | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (formData.title.length > 200) newErrors.title = "Title must be less than 200 characters";
    if (formData.startDate && formData.dueDate && new Date(formData.startDate) > new Date(formData.dueDate)) {
      newErrors.dueDate = "Due date must be after start date";
    }
    if (formData.estimatedHours !== undefined && (isNaN(Number(formData.estimatedHours)) || Number(formData.estimatedHours) < 0)) {
      newErrors.estimatedHours = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix the errors");

    try {
      await createTaskMutation.mutateAsync({
        ...formData,
        projectId: null, 
        workspaceId: null,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : null,
        assigneeIds: [], 
        labelIds: [],
      });
      toast.success("Task created successfully!");
      router.push("/dashboard/tasks");
    } catch (error) {
      console.error("Create task error:", error);
      toast.error("Failed to create task");
    }
  };

  const handleCancel = () => router.push("/dashboard/tasks");

  const priorityColors = {
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const isLoading = createTaskMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-accent transition"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Personal Task</h1>
            <p className="text-muted-foreground mt-1">
              Manage your daily productivity and to-do items
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
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              What needs to be done?
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
              placeholder="e.g., Buy groceries, Finish report, Call dentist..."
              autoFocus
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
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition"
              placeholder="Add more details about this task..."
            />
          </div>
        </motion.div>

        {/* Task Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border p-6 space-y-6"
        >
          <h3 className="text-lg font-semibold text-foreground">
            Task Details
          </h3>

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
              Estimated Time (hours)
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
              placeholder="How long will this take? (e.g., 2.5)"
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
          className="rounded-xl bg-primary/5 border border-primary/20 p-4"
        >
          <p className="text-sm text-primary">
            💡 <strong>Tip:</strong> Break down large tasks into smaller, manageable steps for better productivity!
          </p>
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
            disabled={isLoading}
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