"use client";

import { CreateWorkspaceFormActions } from "@/components/Dashboard/CreateWorkspacePage/CreateWorkspaceFormActions";
import { CreateWorkspacePageHeader } from "@/components/Dashboard/CreateWorkspacePage/CreateWorkspacePageHeader";
import { WorkspaceDetailsSection } from "@/components/Dashboard/CreateWorkspacePage/WorkspaceDetailsSection";
import { WorkspacePlanSelector } from "@/components/Dashboard/CreateWorkspacePage/WorkspacePlanSelector";
import { WorkspaceTypeSelector } from "@/components/Dashboard/CreateWorkspacePage/WorkspaceTypeSelector";
import { useCreateWorkspacePage } from "@/hooks/useCreateWorkspacePage";

export default function CreateWorkspacePage() {
  const {
    formData,
    selectedType,
    setSelectedType,
    errors,
    isSubmitting,
    predefinedColors,
    handleSubmit,
    handleCancel,
    updateField,
  } = useCreateWorkspacePage();

  return (
    <div className="max-w-3xl mx-auto">
      <CreateWorkspacePageHeader onCancel={handleCancel} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <WorkspaceTypeSelector
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
        />

        <WorkspaceDetailsSection
          name={formData.name}
          description={formData.description}
          color={formData.color}
          isPublic={formData.isPublic}
          colors={predefinedColors}
          errors={errors}
          onNameChange={(value) => updateField("name", value)}
          onDescriptionChange={(value) => updateField("description", value)}
          onColorChange={(value) => updateField("color", value)}
          onPublicChange={(value) => updateField("isPublic", value)}
        />

        <WorkspacePlanSelector
          selectedPlan={formData.plan}
          onPlanSelect={(plan) => updateField("plan", plan)}
        />

        <CreateWorkspaceFormActions
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}