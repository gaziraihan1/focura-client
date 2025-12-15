"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Calendar,
  // Flag,
  // Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Brain,
  Clock,
  // Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";

export default function AddTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO" as CreateTaskDto["status"],
    priority: "MEDIUM" as CreateTaskDto["priority"],
    startDate: "",
    dueDate: "",
    estimatedHours: undefined as number | undefined,

    // 🔥 Focura fields
    focusRequired: false,
    focusLevel: 3,
    energyType: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    distractionCost: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (formData.title.length > 200)
      newErrors.title = "Title must be under 200 characters";

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.startDate) > new Date(formData.dueDate)
    ) {
      newErrors.dueDate = "Due date must be after start date";
    }

    if (
      formData.estimatedHours !== undefined &&
      (isNaN(formData.estimatedHours) || formData.estimatedHours < 0)
    ) {
      newErrors.estimatedHours = "Invalid estimated hours";
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
        assigneeIds: [],
        labelIds: [],
      });

      toast.success("Task created successfully");
      router.push("/dashboard/tasks");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleCancel = () => router.push("/dashboard/tasks");

  const isLoading = createTaskMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-accent">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Create Personal Task</h1>
            <p className="text-muted-foreground">
              Capture tasks with focus and energy awareness
            </p>
          </div>
        </div>
        <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-accent">
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task core */}
        <motion.div className="rounded-xl bg-card border border-border p-6 space-y-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-primary" />
            <h3 className="text-lg font-semibold">Task Details</h3>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 ring-primary ${
                errors.title ? "border-red-500" : "border-border"
              }`}
              placeholder="What needs to be done?"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background resize-none"
            placeholder="Optional details"
          />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Status */}
  <div>
    <label className="block text-sm font-medium mb-2">
      Status
    </label>
    <select
      value={formData.status}
      onChange={(e) =>
        setFormData((p) => ({
          ...p,
          status: e.target.value as CreateTaskDto["status"],
        }))
      }
      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 ring-primary"
    >
      <option value="TODO">To Do</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
    </select>
  </div>

  {/* Priority */}
  <div>
    <label className="block text-sm font-medium mb-2">
      Priority
    </label>
    <div className="grid grid-cols-2 gap-2">
      {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((level) => (
        <button
          key={level}
          type="button"
          onClick={() =>
            setFormData((p) => ({ ...p, priority: level }))
          }
          className={`px-3 py-2 rounded-lg border text-sm transition ${
            formData.priority === level
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
</div>


        {/* Focus & Energy */}
        <motion.div className="rounded-xl bg-card border border-border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Brain className="text-primary" />
            <h3 className="text-lg font-semibold">Focus & Energy</h3>
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm">Requires deep focus</span>
            <input
              type="checkbox"
              checked={formData.focusRequired}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  focusRequired: e.target.checked,
                }))
              }
              className="accent-primary"
            />
          </label>

          {formData.focusRequired && (
            <>
              <div>
                <label className="text-sm mb-2 block">
                  Focus Level (1–5)
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={formData.focusLevel}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      focusLevel: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">
                  Energy Required
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["LOW", "MEDIUM", "HIGH"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          energyType: level as any,
                        }))
                      }
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        formData.energyType === level
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">
                  Distraction Cost
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={formData.distractionCost}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      distractionCost: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border"
                />
              </div>
            </>
          )}
        </motion.div>

        {/* Dates */}
        <motion.div className="rounded-xl bg-card border border-border p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-2 block">
              <Calendar size={14} className="inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, startDate: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-border"
            />
          </div>

          <div>
            <label className="text-sm mb-2 block">
              <Calendar size={14} className="inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, dueDate: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-border"
            />
          </div>
          <div>
  <label className="block text-sm font-medium mb-2">
    <Clock size={14} className="inline mr-1" />
    Estimated Time (hours)
  </label>
  <input
    type="number"
    min={0}
    step={0.5}
    value={formData.estimatedHours ?? ""}
    onChange={(e) =>
      setFormData((p) => ({
        ...p,
        estimatedHours: e.target.value
          ? Number(e.target.value)
          : undefined,
      }))
    }
    className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 ring-primary ${
      errors.estimatedHours ? "border-red-500" : "border-border"
    }`}
    placeholder="e.g. 1.5"
  />
</div>

        </motion.div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg border border-border"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Creating
              </>
            ) : (
              <>
                <Save size={16} />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
