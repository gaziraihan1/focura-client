'use client';

import { CreateWorkspaceFormActions } from '@/components/Dashboard/CreateWorkspacePage/CreateWorkspaceFormActions';
import { CreateWorkspacePageHeader } from '@/components/Dashboard/CreateWorkspacePage/CreateWorkspacePageHeader';
import { WorkspaceDetailsSection } from '@/components/Dashboard/CreateWorkspacePage/WorkspaceDetailsSection';
import { WorkspacePlanSelector } from '@/components/Dashboard/CreateWorkspacePage/WorkspacePlanSelector';
import { WorkspaceTypeSelector } from '@/components/Dashboard/CreateWorkspacePage/WorkspaceTypeSelector';
import { useCreateWorkspacePage } from '@/hooks/useCreateWorkspacePage';

const STEPS = [
  { num: 1, label: 'Type' },
  { num: 2, label: 'Details' },
  { num: 3, label: 'Plan' },
];

export default function CreateWorkspacePage() {
  const {
    formData,
    selectedType,
    setSelectedType,
    selectedPlan,
    setSelectedPlan,
    errors,
    isSubmitting,
    predefinedColors,
    handleSubmit,
    handleCancel,
    updateField,
  } = useCreateWorkspacePage();

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <CreateWorkspacePageHeader onCancel={handleCancel} />

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8 px-1">
        {STEPS.map((step, i) => (
          <div key={step.num} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors $
                  i <= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.num}
              </div>
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-border" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          onNameChange={(value) => updateField('name', value)}
          onDescriptionChange={(value) => updateField('description', value)}
          onColorChange={(value) => updateField('color', value)}
          onPublicChange={(value) => updateField('isPublic', value)}
        />

        <WorkspacePlanSelector
          selectedPlan={selectedPlan}
          onPlanSelect={setSelectedPlan}
        />

        <CreateWorkspaceFormActions
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}