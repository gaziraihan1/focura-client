// WorkspaceProjectCard.tsx
import { useWorkspaceProjectsPage } from "@/hooks/useProjectsPage";
import { useProjectDetails } from "@/hooks/useProjects";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { AccessDeniedModal } from "./AceessDeniedModal";
import { CardLoadingState } from "@/components/Shared/CardLoadingState";

interface WorkspaceProjectCardProps {
  projectId: string;
  workspaceSlug: string;
  currentUserId?: string;
}

export function WorkspaceProjectCard({
  projectId,
  workspaceSlug,
  currentUserId,
}: WorkspaceProjectCardProps) {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const { data: project, isLoading } = useProjectDetails(projectId);
  const { canCreateProjects } = useWorkspaceProjectsPage({ workspaceSlug });

  const joined = project?.members?.some((m) => m.user?.id === currentUserId);
  const haveAccess = joined || canCreateProjects;

  if (isLoading || !project) {
    return (
      <div className="w-full h-full flex items-center justify-center p-14">
        <CardLoadingState />
      </div>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!haveAccess) {
      e.preventDefault();
      setShowAccessModal(true);
    }
  };

  return (
    <>
      <ProjectCard
        project={project}
        workspaceSlug={workspaceSlug}
        haveAccess={haveAccess}
        joined={joined}
        currentUserId={currentUserId}
        onClick={handleClick}
      />

      <AccessDeniedModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
      />
    </>
  );
}