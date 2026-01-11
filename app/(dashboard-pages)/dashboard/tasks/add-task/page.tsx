"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Brain,
  Clock,
  Zap,
  Lightbulb,
  Eye,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCreateTask, CreateTaskDto } from "@/hooks/useTask";

// Intent options with icons and descriptions
const INTENT_OPTIONS = [
  {
    value: "EXECUTION",
    label: "Do Work",
    icon: Zap,
    description: "Active implementation and building",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
  },
  {
    value: "PLANNING",
    label: "Think & Plan",
    icon: Lightbulb,
    description: "Strategy and organization",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500",
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: Eye,
    description: "Check and validate work",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
  },
  {
    value: "LEARNING",
    label: "Learn",
    icon: BookOpen,
    description: "Research and education",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500",
  },
  {
    value: "COMMUNICATION",
    label: "Communicate",
    icon: MessageSquare,
    description: "Meetings and discussions",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500",
  },
] as const;

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
    intent: "EXECUTION" as "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION", 
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

  // Get the current selected intent option
  const selectedIntent = INTENT_OPTIONS.find(
    (opt) => opt.value === formData.intent
  );

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl lg:text-3xl font-bold">Create Personal Task</h1>
            <p className="text-muted-foreground">
              Capture tasks with focus and energy awareness
            </p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-accent"
        >
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

        {/* ✅ NEW: Task Intent Section */}
        <motion.div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            {selectedIntent && <selectedIntent.icon className={selectedIntent.color} size={20} />}
            <h3 className="text-lg font-semibold">Task Intent</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            What kind of work is this task?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {INTENT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.intent === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, intent: option.value }))
                  }
                  className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected
                      ? `${option.bgColor} ${option.borderColor}`
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Icon
                      size={24}
                      className={isSelected ? option.color : "text-muted-foreground"}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? option.color : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 size={16} className={option.color} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Description of selected intent */}
          {selectedIntent && (
            <div className={`p-3 rounded-lg ${selectedIntent.bgColor} border ${selectedIntent.borderColor}`}>
              <p className={`text-sm ${selectedIntent.color}`}>
                <strong>{selectedIntent.label}:</strong> {selectedIntent.description}
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
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
            <label className="block text-sm font-medium mb-2">Priority</label>
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
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Light</span>
                  <span className="font-medium">{formData.focusLevel}</span>
                  <span>Deep</span>
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Energy Required</label>
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
                <label className="text-sm mb-2 block">Distraction Cost</label>
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
                <p className="text-xs text-muted-foreground mt-1">
                  How much does interruption cost? (0-5)
                </p>
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

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg border border-border hover:bg-accent transition"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
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