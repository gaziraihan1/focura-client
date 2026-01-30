"use client";

import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import LabelCard from "./LabelCard";
import LabelFormModal from "./LabelFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import AccessDenied from "./AccessDenied";
import { useLabelPage } from "@/hooks/useLabelPage";
import { LabelManagementHeader } from "./LabelManagementMain/LabelManagementHeader";
import { LabelsEmptyState } from "./LabelManagementMain/LabelsEmptyState";

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
  const {
    router,
    searchQuery,
    setSearchQuery,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingLabel,
    setEditingLabel,
    deletingLabel,
    setDeletingLabel,
    activeDropdown,
    setActiveDropdown,
    isRoleLoading,
    filteredLabels,
    isLoading,
    canManageLabels,
  } = useLabelPage(workspaceId);

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
      <LabelManagementHeader
        workspaceSlug={workspaceSlug}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => router.push(`/dashboard/workspaces/${workspaceSlug}`)}
        onCreateLabel={() => setIsCreateModalOpen(true)}
      />

      <main className="mx-auto py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!isLoading && filteredLabels.length === 0 && (
          <LabelsEmptyState
            searchQuery={searchQuery}
            onCreateLabel={() => setIsCreateModalOpen(true)}
          />
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
                      activeDropdown === label.id ? null : label.id,
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
