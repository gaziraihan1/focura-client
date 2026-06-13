// WorkspaceProjectCard.tsx
import { ProjectDetails } from "@/hooks/useProjects";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { AccessDeniedModal } from "./AceessDeniedModal";

interface WorkspaceProjectCardProps {
  project: ProjectDetails;
  workspaceSlug: string;
  currentUserId?: string;
  canCreateProjects?: boolean
}

export function WorkspaceProjectCard({
  project,
  workspaceSlug,
  currentUserId,
  canCreateProjects,
}: WorkspaceProjectCardProps) {
  const [showAccessModal, setShowAccessModal] = useState(false);

  const joined = project?.members?.some((m) => m.user?.id === currentUserId);
  const haveAccess = joined || canCreateProjects;

  

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