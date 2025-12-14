"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useCreateWorkspace } from "@/hooks/useWorkspace";

const PREDEFINED_COLORS = [
  "#667eea", 
  "#3B82F6", 
  "#10B981", 
  "#F59E0B",
  "#EF4444",  
  "#8B5CF6",
  "#EC4899", 
  "#14B8A6", 
];

const WORKSPACE_TYPES = [
  {
    id: "personal",
    icon: "👤",
    title: "Personal",
    description: "For individual work and personal projects",
  },
  {
    id: "team",
    icon: "👥",
    title: "Team",
    description: "Collaborate with your team members",
  },
  {
    id: "company",
    icon: "🏢",
    title: "Company",
    description: "For entire organization",
  },
];

export default function CreateWorkspacePage() {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: PREDEFINED_COLORS[0],
    isPublic: false,
    plan: "FREE" as "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE",
  });

  const [selectedType, setSelectedType] = useState("team");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  createWorkspace.mutate(formData);
};
  const handleCancel = () => {
    router.push("/dashboard/workspaces");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Workspace
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a new workspace for your team
          </p>
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
          className="rounded-xl bg-card border border-border p-6"
        >
          <label className="block text-sm font-medium text-foreground mb-4">
            <Sparkles size={16} className="inline mr-2" />
            Workspace Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORKSPACE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-xl border-2 transition text-left ${
                  selectedType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">
                  {type.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Acme Inc, My Team, Design Projects"
              className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none transition ${
                errors.name ? "border-red-500" : "border-border"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This will be visible to all workspace members
            </p>
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
              placeholder="What's this workspace about?"
              className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition ${
                errors.description ? "border-red-500" : "border-border"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Workspace Color
            </label>
            <div className="flex flex-wrap gap-3">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color }))
                  }
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="font-medium text-foreground">
                  Make workspace public
                </p>
                <p className="text-sm text-muted-foreground">
                  Anyone with the link can view this workspace
                </p>
              </div>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card border border-border p-6"
        >
          <label className="block text-sm font-medium text-foreground mb-4">
            Select Plan
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                plan: "FREE",
                label: "Free",
                desc: "Perfect for getting started",
                price: "$0/mo",
              },
              {
                plan: "PRO",
                label: "Pro",
                desc: "For growing teams",
                price: "$10/mo",
              },
            ].map((option) => (
              <button
                key={option.plan}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    plan: option.plan as "FREE" | "PRO" | "BUSINESS"  | "ENTERPRISE",
                  }))
                }
                className={`p-4 rounded-xl border-2 transition text-left ${
                  formData.plan === option.plan
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">
                    {option.label}
                  </h3>
                  <span className="text-sm font-medium text-primary">
                    {option.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={createWorkspace.isPending}
            className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createWorkspace.isPending}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
          >
            {createWorkspace.isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Workspace
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}