"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SprintList from "@/components/Dashboard/ProjectDetails/SprintList";
import { ProjectManagerOnly } from "@/components/Dashboard/ProjectDetails/ProjectManagerOnly";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";

export default function ProjectSprintsPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params?.projectSlug as string;
  const { data: project } = useProjectDetailsBySlug(projectSlug);

  return (
    <ProjectManagerOnly project={project}>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sprints</h1>
          <p className="text-xs text-muted-foreground mt-1">Plan and track time-boxed iterations with velocity tracking.</p>
        </div>
        {project?.id && <SprintList projectId={project.id} />}
      </div>
    </ProjectManagerOnly>
  );
}
