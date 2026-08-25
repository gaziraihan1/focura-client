// WorkspaceProjectCard.tsx
import { ProjectDetails } from "@/hooks/useProjects";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { qc } from "@/lib/react-query/query-client";
import { projectKeys } from "@/hooks/projectKeys";
import { ProjectCard } from "./ProjectCard";
import { AccessDeniedModal } from "./AceessDeniedModal";

interface WorkspaceProjectCardProps {
  project: ProjectDetails;
  workspaceSlug: string;
  currentUserId?: string;
  canCreateProjects?: boolean;
}

export function WorkspaceProjectCard({
  project,
  workspaceSlug,
  currentUserId,
  canCreateProjects,
}: WorkspaceProjectCardProps) {
  const router = useRouter();
  const [showAccessModal, setShowAccessModal] = useState(false);
  const healedRef = useRef(false);

  const joined = project?.members?.some((m) => m.user?.id === currentUserId);
  const haveAccess = joined || canCreateProjects;

  const handleClick = async (e: React.MouseEvent) => {
    if (haveAccess) return;
    e.preventDefault();

    // Self-heal: the workspace project list in THIS browser may predate the
    // user being added as a member — the owner's cache invalidation only
    // clears the owner's React Query cache, never the collaborator's. Refetch
    // once; if the fresh list shows membership, navigate instead of denying.
    if (!healedRef.current) {
      healedRef.current = true;
      try {
        await qc.refetchQueries({ queryKey: projectKeys.lists(), exact: false });
        const freshLists = qc.getQueriesData<ProjectDetails[]>({
          queryKey: projectKeys.lists(),
          exact: false,
        });
        const freshProject = freshLists
          .flatMap(([, data]) => data ?? [])
          .find((p) => p.id === project.id);
        const freshJoined = freshProject?.members?.some(
          (m) => m.user?.id === currentUserId,
        );
        if (freshJoined || canCreateProjects) {
          router.push(
            `/dashboard/workspaces/${workspaceSlug}/projects/${project.slug}`,
          );
          return;
        }
      } catch {
        // Refetch failed — fall through to the modal.
      }
    }
    setShowAccessModal(true);
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
