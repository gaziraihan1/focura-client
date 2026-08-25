"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/dashboard/projects/all-projects/NewProject/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { NewProjectPageHeader } from "@/components/dashboard/projects/all-projects/NewProject/NewProjectPageHeader";
import { ProjectBasicInfoSection } from "@/components/dashboard/projects/all-projects/NewProject/ProjectBasicInfoSection";
import { ProjectFormActions } from "@/components/dashboard/projects/all-projects/NewProject/ProjectFormActions";
import { ProjectPlanningSection } from "@/components/dashboard/projects/all-projects/NewProject/ProjectPlanningSection";
import ProjectTemplateStarter from "@/components/dashboard/projects/all-projects/NewProject/ProjectTemplateStarter";
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
