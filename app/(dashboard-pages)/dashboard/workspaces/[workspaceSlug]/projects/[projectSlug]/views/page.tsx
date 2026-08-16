"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import ViewList from "@/components/Dashboard/ProjectDetails/ViewList";
import { ProjectManagerOnly } from "@/components/Dashboard/ProjectDetails/ProjectManagerOnly";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";

export default function ProjectViewsPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params?.projectSlug as string;
  const workspaceSlug = params?.workspaceSlug as string;
  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;
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
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Saved Views</h1>
              <p className="text-xs text-muted-foreground">
                Create custom views to quickly switch between different project
                perspectives.
              </p>
            </div>
          </div>
        </div>

        {project?.id && <ViewList projectId={project.id} />}
        {!project?.id && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground italic">Loading project...</p>
          </div>
        )}

        <div className="text-center py-4">
          <button
            onClick={() => router.push(base)}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Go to project overview
          </button>
        </div>
      </div>
    </ProjectManagerOnly>
  );
}
