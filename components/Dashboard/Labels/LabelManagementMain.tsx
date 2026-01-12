"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Loader2, ArrowLeft, Tag } from "lucide-react";
import { useLabels, Label } from "@/hooks/useLabels";
import { useWorkspaceRole } from "@/hooks/useWorkspace";
import { useRouter } from "next/navigation";
import LabelCard from "./LabelCard";
import LabelFormModal from "./LabelFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import AccessDenied from "./AccessDenied";

export interface LabelManagementPageProps {
  workspaceId: string;
  workspaceSlug: string;
}

export interface LabelFormData {
  name: string;
  color: string;
  description: string;
}

export default function LabelManagementMain({
  workspaceId,
  workspaceSlug,
}: LabelManagementPageProps) {
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<Label | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // API Hooks
  const { data: labels = [], isLoading } = useLabels(workspaceId);
  const { canManageWorkspace, isLoading: isRoleLoading } =
    useWorkspaceRole(workspaceId);

  // Check permissions
  const canManageLabels = canManageWorkspace;

  // Filter labels
  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  // Loading state
  if (isRoleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!canManageLabels) {
    return (
      <AccessDenied
        title="Access Denied"
        desc="Only workspace owners and admins can manage labels"
        btnText="Back to Workspace"
        workspaceSlug={workspaceSlug}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card rounded border-border sticky top-0 z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  router.push(`/dashboard/workspaces/${workspaceSlug}`)
                }
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-foreground">
                  Label Management
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create and manage labels for your workspace
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search labels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Create Label</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!isLoading && filteredLabels.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "No labels found" : "No labels yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first label to organize your tasks"}
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Create Label</span>
              </motion.button>
            )}
          </div>
        )}

        {!isLoading && filteredLabels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLabels.map((label) => (
                <LabelCard
                  key={label.id}
                  label={label}
                  onEdit={() => setEditingLabel(label)}
                  onDelete={() => setDeletingLabel(label)}
                  isDropdownActive={activeDropdown === label.id}
                  onDropdownToggle={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(
                      activeDropdown === label.id ? null : label.id
                    );
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isCreateModalOpen && (
          <LabelFormModal
            title="Create Label"
            workspaceId={workspaceId}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
        {editingLabel && (
          <LabelFormModal
            title="Edit Label"
            initialData={editingLabel}
            workspaceId={workspaceId}
            onClose={() => setEditingLabel(null)}
          />
        )}
        {deletingLabel && (
          <DeleteConfirmModal
            label={deletingLabel}
            onClose={() => setDeletingLabel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
