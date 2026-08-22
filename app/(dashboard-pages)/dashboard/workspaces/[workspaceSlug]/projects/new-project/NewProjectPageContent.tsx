"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/Dashboard/Projects/NewProject/ErrorState";
import { LoadingState } from "@/components/Shared/LoadingState";
import { NewProjectPageHeader } from "@/components/Dashboard/Projects/NewProject/NewProjectPageHeader";
import { ProjectBasicInfoSection } from "@/components/Dashboard/Projects/NewProject/ProjectBasicInfoSection";
import { ProjectFormActions } from "@/components/Dashboard/Projects/NewProject/ProjectFormActions";
import { ProjectPlanningSection } from "@/components/Dashboard/Projects/NewProject/ProjectPlanningSection";
import ProjectTemplateStarter from "@/components/Dashboard/Projects/NewProject/ProjectTemplateStarter";
import { useWorkspaceNewProjectPage } from "@/hooks/useProjectsPage";

interface NewProjectPageContentProps {
  workspaceSlug: string;
}

export function NewProjectPageContent({ workspaceSlug }: NewProjectPageContentProps) {
  const router = useRouter();

  const {
    workspace,
    hasAccess,
    canCreateProjects,
    form,
    errors,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleCancel,
    updateField,
  } = useWorkspaceNewProjectPage({ workspaceSlug });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!workspace) {
    return (
      <ErrorState
        type="not-found"
        onNavigate={() => router.push("/dashboard/workspaces")}
      />
    );
  }

  if (!hasAccess) {
    return (
      <ErrorState
        type="no-access"
        onNavigate={() => router.push("/dashboard/workspaces")}
      />
    );
  }

  if (!canCreateProjects) {
    return (
      <ErrorState
        type="no-permission"
        workspaceSlug={workspaceSlug}
        onNavigate={() =>
          router.push(`/dashboard/workspaces/${workspaceSlug}/projects`)
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <NewProjectPageHeader onCancel={handleCancel} />

      <ProjectTemplateStarter
        workspaceId={workspace.id}
        workspaceSlug={workspaceSlug}
        plan={workspace.plan}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProjectBasicInfoSection
          form={form}
          errors={errors}
          onFieldChange={updateField}
        />

        <ProjectPlanningSection
          form={form}
          errors={errors}
          onFieldChange={updateField}
        />

        <ProjectFormActions
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}
